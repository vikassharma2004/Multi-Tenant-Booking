import mongoose from "mongoose";
import crypto from "crypto";

const OtpSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  otpHash: { type: String, required: true },
  purpose: { 
    type: String, 
    enum: ["login", "register", "2fa", "password_reset", "phone_verification"], 
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
OtpSchema.statics.generateOtpFor = async function (userId, purpose) {
  const otp = (Math.floor(100000 + Math.random() * 900000)).toString(); // 6-digit OTP
  const hash = crypto.createHash("sha256").update(otp).digest("hex");

  // Delete old OTP for same user-purpose before creating new
  await this.findOneAndDelete({ user: userId, purpose });

  await this.create({ user: userId, otpHash: hash, purpose });
  return otp; // send via SMS/email
};

// 🔹 Static method to verify OTP
OtpSchema.statics.verifyOtp = async function (userId, purpose, enteredOtp) {
  const doc = await this.findOne({ user: userId, purpose });
  if (!doc) return false;

  const enteredHash = crypto.createHash("sha256").update(enteredOtp).digest("hex");

  // Too many failed attempts? Lock it.
  if (doc.attempts >= 5) {
    await doc.deleteOne();
    return false;
  }

  if (doc.otpHash === enteredHash) {
    await doc.deleteOne(); // OTP is single-use → burn it
    return true;
  } else {
    doc.attempts += 1;
    await doc.save();
    return false;
  }
};

export const Otp = mongoose.model("Otp", OtpSchema);
