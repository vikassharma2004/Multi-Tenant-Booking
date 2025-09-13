import mongoose from 'mongoose';

const sellerSessionSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  roleId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true }, // optional, speeds up populates
  tokenHash:  { type: String, required: true, unique: true }, // SHA-256 of JWT jti or refresh-token
  ip:         String,
  ua:         String,                                     // user-agent
  isActive:   { type: Boolean, default: true, index: true },
  expiresAt:  { type: Date, required: true, index: { expireAfterSeconds: 0 } } // TTL
}, { timestamps: true });

// Compound index for quick lookup & logout
sellerSessionSchema.index({ userId: 1, isActive: 1 });

export const SellerSession = mongoose.model('SellerSession', sellerSessionSchema);