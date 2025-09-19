import mongoose from 'mongoose';

const sellerSessionSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  roleId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true }, // only if you query sessions by role
  tokenHash: { type: String, required: true }, // no global unique, but unique per user
  ip:        { type: String },
  ua:        { type: String }, // user-agent
  isActive:  { type: Boolean, default: true, index: true },
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } }
}, { timestamps: true });

// Per-user + tokenHash unique
sellerSessionSchema.index({ userId: 1, tokenHash: 1 }, { unique: true });

// Query active sessions quickly
sellerSessionSchema.index({ userId: 1, roleId: 1, isActive: 1 });

export const SellerSession = mongoose.model('SellerSession', sellerSessionSchema);
