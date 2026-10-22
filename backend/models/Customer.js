import mongoose from 'mongoose';
const customerSchema = new mongoose.Schema({
 name: { type: String, required: true, trim: true },
 email: { type: String, required: true, unique: true, lowercase: true, trim: true },
 phone: { type: String, required: true, trim: true },
 licenseNumber: { type: String, required: true, unique: true, trim: true },
 passwordHash: { type: String, required: true, select: false },
 role: { type: String, enum: ['customer', 'manager', 'admin'], default: 'customer' }
}, { timestamps: true });
export default mongoose.model('Customer', customerSchema);