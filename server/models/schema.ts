import mongoose from 'mongoose';

const languageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  count: { type: Number, required: true, default: 0 },
  percentage: { type: Number, required: true, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const statusSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  color: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export const Language = mongoose.model('Language', languageSchema);
export const Status = mongoose.model('Status', statusSchema);
