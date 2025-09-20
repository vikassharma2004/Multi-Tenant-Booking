import mongoose from "mongoose";
import crypto from "crypto";

const OtpSchema = new mongoose.Schema({
   email: { type: String, required: true, index: true }, // changed from user
  otpHash: { type: String, required: true },
  purpose: { 
    type: String, 
    enum: ["login", "register", "2fa", "password_reset", "email_verification"], 
    required: true, 
    index: true 
  },
  attempts: { type: Number, default: 0 }, // track brute force attempts
  createdAt: { type: Date, default: Date.now, index: true }
});

// TTL index – auto delete after 5 mins
OtpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

// Ensure only 1 active OTP per user + purpose
OtpSchema.index({ user: 1, purpose: 1 }, { unique: true });

// 🔹 Static method to generate OTP
// Generate OTP
OtpSchema.statics.generateOtpFor = async function (email, purpose) {
  const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
  const hash = crypto.createHash("sha256").update(otp).digest("hex");

  // Delete old OTP for same email + purpose
  await this.findOneAndDelete({ email, purpose });

  await this.create({ email, otpHash: hash, purpose });
  return otp;
};
// 🔹 Static method to verify OTP

// Verify OTP
OtpSchema.statics.verifyOtp = async function (email, purpose, enteredOtp) {
  const doc = await this.findOne({ email, purpose });
  if (!doc) return false;

  const enteredHash = crypto.createHash("sha256").update(enteredOtp).digest("hex");

  if (doc.attempts >= 5) {
    await doc.deleteOne();
    return false;
  }

  if (doc.otpHash === enteredHash) {
    await doc.deleteOne();
    return true;
  } else {
    doc.attempts += 1;
    await doc.save();
    return false;
  }
};
export const Otp = mongoose.model("Otp", OtpSchema);
