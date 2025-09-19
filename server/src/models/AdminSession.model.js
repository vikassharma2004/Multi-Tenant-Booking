import mongoose from 'mongoose';

const AdminSessionSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  roleId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  tokenHash:  { type: String, required: true, unique: true }, // hash of JWT jti or refresh token
  ip:         String,
  ua:         String,
  isActive:   { type: Boolean, default: true, index: true },
  expiresAt:  { type: Date, required: true, index: true } // TTL handled separately
}, { timestamps: true });

// TTL index – Mongo will delete doc once expiresAt is reached
AdminSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Compound index for quick lookup
AdminSessionSchema.index({ userId: 1, isActive: 1 });

/* Optional static method: enforce max 2 sessions per user */
AdminSessionSchema.statics.cleanOldSessions = async function(userId, maxSessions = 2) {
  const activeSessions = await this.find({ userId, isActive: true }).sort({ createdAt: 1 });
  if (activeSessions.length >= maxSessions) {
    const excess = activeSessions.slice(0, activeSessions.length - (maxSessions - 1));
    await Promise.all(excess.map(s => s.updateOne({ isActive: false })));
  }
};

export const AdminSession = mongoose.model('AdminSession', AdminSessionSchema);
