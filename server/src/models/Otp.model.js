import mongoose from "mongoose";
import crypto from "crypto";

const OtpSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  otpHash: { type: String, required: true }, // hashed OTP for security
  purpose: { 
    type: String, 
    enum: ["login", "register", "2fa", "password_reset", "phone_verification"], 
    required: true, 
    index: true 
  },
  createdAt: { type: Date, default: Date.now, index: true }
});

// TTL index – OTP expires after 5 minutes
OtpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

// Static method to generate OTP
OtpSchema.statics.generateOtpFor = async function (userId, purpose) {
  const otp = (Math.floor(100000 + Math.random() * 900000)).toString(); // 6-digit OTP
  const hash = crypto.createHash("sha256").update(otp).digest("hex");

  await this.create({ user: userId, otpHash: hash, purpose });
  return otp; // Return plain OTP to send via SMS/email
};

// Instance method to verify OTP
OtpSchema.methods.verifyOtp = function (enteredOtp) {
  const enteredHash = crypto.createHash("sha256").update(enteredOtp).digest("hex");
  return this.otpHash === enteredHash;
};

export const Otp = mongoose.model("Otp", OtpSchema);
