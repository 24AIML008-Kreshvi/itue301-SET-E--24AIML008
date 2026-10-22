import mongoose from 'mongoose';
const vehicleSchema = new mongoose.Schema({
 model: { type: String, required: true, trim: true },
 type: { type: String, required: true, enum: ['Hatchback', 'Sedan', 'SUV'] },
 pricePerDay: { type: Number, required: true, min: 0 },
 available: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.model('Vehicle', vehicleSchema);