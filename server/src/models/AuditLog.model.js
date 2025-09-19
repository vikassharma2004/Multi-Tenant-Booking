import mongoose from "mongoose";

const AuditSchema = new mongoose.Schema({
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  action: { 
    type: String, 
    enum: [
      'create', 'update', 'delete', 'login', 'logout', 
      'approve', 'reject', 'status_change', 'other'
    ], 
    required: true 
  },
  targetType: { 
    type: String, 
    enum: ['hotel', 'room', 'booking', 'review', 'seller', 'user', 'application'], 
    required: true, 
    index: true 
  },
  target: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  metadata: { type: mongoose.Schema.Types.Mixed }, // store old/new values, extra context
  ip: String,      // optional: track actor IP
  ua: String       // optional: track user-agent
}, { timestamps: true, strict: true });

// Compound index for quick seller dashboard queries
AuditSchema.index({ actor: 1, targetType: 1, target: 1, createdAt: -1 });

export const AuditLog = mongoose.model("AuditLog", AuditSchema);
