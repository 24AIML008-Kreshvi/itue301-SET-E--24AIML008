import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Customer from './models/Customer.js';
import Vehicle from './models/Vehicle.js';
async function main() {
 if (!process.env.MONGO_URI) throw new Error('Set MONGO_URI in backend/.env first');
 await mongoose.connect(process.env.MONGO_URI);
 const passwordHash = await bcrypt.hash('Demo@12345', 10);
 const people = [
  { name: 'Demo Customer', email: 'customer@driveeasy.test', phone: '9876543210', licenseNumber: 'DEMO-CUST-001', role: 'customer' },
  { name: 'Fleet Manager', email: 'manager@driveeasy.test', phone: '9876543211', licenseNumber: 'DEMO-MGR-001', role: 'manager' },
  { name: 'Admin User', email: 'admin@driveeasy.test', phone: '9876543212', licenseNumber: 'DEMO-ADMIN-001', role: 'admin' }
 ];
 for (const person of people) await Customer.updateOne({ email: person.email }, { $setOnInsert: { ...person, passwordHash } }, { upsert: true });
 const vehicles = [
  { model: 'Maruti Suzuki Baleno', type: 'Hatchback', pricePerDay: 1800 },
  { model: 'Hyundai i20', type: 'Hatchback', pricePerDay: 1900 },
  { model: 'Honda City', type: 'Sedan', pricePerDay: 2600 },
  { model: 'Hyundai Verna', type: 'Sedan', pricePerDay: 2700 },
  { model: 'Kia Seltos', type: 'SUV', pricePerDay: 3400 },
  { model: 'Mahindra XUV700', type: 'SUV', pricePerDay: 4500 }
 ];
 for (const vehicle of vehicles) await Vehicle.updateOne({ model: vehicle.model }, { $setOnInsert: vehicle }, { upsert: true });
 console.log('Demo accounts and vehicles seeded. Password for all demo accounts: Demo@12345');
 await mongoose.disconnect();
}
main().catch(error => { console.error(error); process.exit(1); });