import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Customer from './models/Customer.js';
import Vehicle from './models/Vehicle.js';
import Booking from './models/Booking.js';
import authGuard from './middleware/authGuard.js';
import requestLogger from './middleware/requestLogger.js';
const app = express();
app.use(requestLogger);
app.use(cors());
app.use(express.json());
const asyncRoute = fn => (req,res,next) => Promise.resolve(fn(req,res,next)).catch(next);
app.post('/api/v1/auth/login',asyncRoute(async(req,res)=>{
 const {email,password}=req.body;
 if(!email||!password)return res.status(400).json({message:'Email and password are required'});
 const customer=await Customer.findOne({email:String(email).trim().toLowerCase()}).select('+passwordHash');
 if(!customer||!(await bcrypt.compare(password,customer.passwordHash)))return res.status(401).json({message:'Incorrect email or password'});
 const token=jwt.sign({id:customer.id,role:customer.role},process.env.JWT_SECRET,{expiresIn:'8h'});
 res.json({token,customer:{id:customer.id,name:customer.name,email:customer.email,role:customer.role}});
}));
app.get('/api/v1/vehicles',asyncRoute(async(_req,res)=>res.json(await Vehicle.find().sort({model:1}))));
app.post('/api/v1/bookings',authGuard,asyncRoute(async(req,res)=>{
 const {vehicleId,pickupDate,returnDate}=req.body;
 if(!mongoose.isValidObjectId(vehicleId)||!pickupDate||!returnDate||!Number.isFinite(Date.parse(pickupDate))||!Number.isFinite(Date.parse(returnDate))||new Date(returnDate)<=new Date(pickupDate))return res.status(400).json({message:'Select a valid vehicle and date range (return after pickup)'});
 // Atomic availability claim avoids simultaneous double-booking.
 const vehicle=await Vehicle.findOneAndUpdate({_id:vehicleId,available:true},{$set:{available:false}},{new:true});
 if(!vehicle)return res.status(400).json({message:'Vehicle not found or already unavailable'});
 try{
  const booking=await Booking.create({customerId:req.user.id,vehicleId,pickupDate,returnDate});
  res.status(201).json(booking);
 }catch(error){await Vehicle.findByIdAndUpdate(vehicleId,{available:true});throw error;}
}));
app.get('/api/v1/bookings/my',authGuard,asyncRoute(async(req,res)=>{
 res.json(await Booking.find({customerId:req.user.id}).populate('customerId','name email').populate('vehicleId','model type').sort({createdAt:-1}));
}));
app.patch('/api/v1/bookings/:id/status',authGuard,asyncRoute(async(req,res)=>{
 const {status}=req.body;
 if(!mongoose.isValidObjectId(req.params.id)||!['reserved','ongoing','completed','cancelled'].includes(status))return res.status(400).json({message:'Invalid booking ID or status'});
 const booking=await Booking.findById(req.params.id);
 if(!booking)return res.status(404).json({message:'Booking not found'});
 const owner=booking.customerId.toString()===req.user.id;
 const staff=['manager','admin'].includes(req.user.role);
 if(!staff&&!(owner&&status==='cancelled'&&booking.status==='reserved'))return res.status(403).json({message:'Not allowed to change this booking status'});
 if(['completed','cancelled'].includes(booking.status))return res.status(400).json({message:'Booking is already closed'});
 if(!staff&&status!=='cancelled')return res.status(403).json({message:'Only staff can set this status'});
 booking.status=status;await booking.save();
 if(['completed','cancelled'].includes(status))await Vehicle.findByIdAndUpdate(booking.vehicleId,{available:true});
 res.json(booking);
}));
app.get('/api/v1/admin/summary',authGuard,asyncRoute(async(req,res)=>{
 if(!['admin','manager'].includes(req.user.role))return res.status(403).json({message:'Staff only'});
 res.json({customers:await Customer.countDocuments(),vehicles:await Vehicle.countDocuments(),bookings:await Booking.countDocuments()});
}));
app.use((_req,res)=>res.status(404).json({message:'Route not found'}));
app.use((err,_req,res,_next)=>{
 console.error(err);
 if(err.name==='ValidationError'||err.name==='CastError')return res.status(400).json({message:err.message});
 if(err.code===11000)return res.status(400).json({message:'Duplicate value violates a unique field'});
 res.status(500).json({message:'Internal server error'});
});
if(!process.env.MONGO_URI||!process.env.JWT_SECRET){console.error('Configure MONGO_URI and JWT_SECRET in backend/.env');process.exit(1);}
mongoose.connect(process.env.MONGO_URI).then(()=>app.listen(process.env.PORT||5000,()=>console.log(`DriveEasy API running on port ${process.env.PORT||5000}`))).catch(error=>{console.error('MongoDB connection failed:',error.message);process.exit(1);});
