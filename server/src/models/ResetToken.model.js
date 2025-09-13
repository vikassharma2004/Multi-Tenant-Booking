import mongoose from "mongoose";
import crypto from "crypto";

const ResetTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  tokenHash: { type: String, required: true },
  used: { type: Boolean, default: false, index: true },
  createdAt: { type: Date, default: Date.now, index: true },
});

// Auto-delete after 1 hour
ResetTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

// 🔑 Generate reset token
ResetTokenSchema.statics.createTokenFor = async function(userId) {
    await this.deleteMany({ user: userId });
  const token = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  await this.create({ user: userId, tokenHash: hash });
  return token;
};

// 🔎 Verify reset token
ResetTokenSchema.statics.verifyToken = async function(userId, token) {
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  return this.findOne({ user: userId, tokenHash: hash, used: false });
};

// ✅ Mark token as used
ResetTokenSchema.methods.markUsed = async function() {
  this.used = true;
  await this.save();
};

export const ResetToken = mongoose.model("ResetToken", ResetTokenSchema);
