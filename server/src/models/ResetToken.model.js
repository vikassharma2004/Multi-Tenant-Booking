import mongoose from "mongoose";
import crypto from "crypto";

const ResetTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  tokenHash: { type: String, required: true },
  used: { type: Boolean, default: false, index: true },
  createdAt: { type: Date, default: Date.now },
  validUntil: { type: Date, default: () => Date.now() + 3600 * 1000, index: true }, // ✅ explicit expiry
  ip: String, // optional - bind to request origin
  ua: String  // optional - bind to user-agent
});

// TTL cleanup (extra safety)
ResetTokenSchema.index({ validUntil: 1 }, { expireAfterSeconds: 0 });

// 🔑 Generate reset token
ResetTokenSchema.statics.createTokenFor = async function(userId, ip, ua) {
  await this.deleteMany({ user: userId }); // ✅ invalidate all old tokens

  const token = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(token).digest('hex');

  await this.create({ user: userId, tokenHash: hash, ip, ua });
  return token;
};

// 🔎 Verify reset token
ResetTokenSchema.statics.verifyToken = async function(userId, token, ip, ua) {
  const hash = crypto.createHash("sha256").update(token).digest("hex");

  const resetToken = await this.findOne({ user: userId, tokenHash: hash, used: false });
  if (!resetToken) return null;

  if (resetToken.validUntil < new Date()) return null; // ✅ explicit check
  if (ip && resetToken.ip && resetToken.ip !== ip) return null; // optional binding
  if (ua && resetToken.ua && resetToken.ua !== ua) return null;

  return resetToken;
};

// ✅ Mark token as used
ResetTokenSchema.methods.markUsed = async function() {
  this.used = true;
  await this.save();
};

export const ResetToken = mongoose.model("ResetToken", ResetTokenSchema);
