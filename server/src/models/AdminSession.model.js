import mongoose from 'mongoose';

const adminSessionSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  roleId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  tokenHash:  { type: String, required: true, unique: true },
  ip:         String,
  ua:         String,
  isActive:   { type: Boolean, default: true, index: true },
  expiresAt:  { type: Date, required: true, index: { expireAfterSeconds: 0 } }
}, { timestamps: true });

adminSessionSchema.index({ userId: 1, isActive: 1 });

export const AdminSession = mongoose.model('AdminSession', adminSessionSchema);