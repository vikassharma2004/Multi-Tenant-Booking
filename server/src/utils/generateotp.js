import crypto from "crypto";
import { Otp } from "../models/Otp.model.js";

export const generateOtpHash = () => (Math.floor(100000 + Math.random() * 900000)).toString();

export const hashOtp = (otp) => crypto.createHash("sha256").update(otp).digest("hex");

export const verifyOtp = async (userId, otp, purpose) => {
  const otpHash = hashOtp(otp);
  const record = await Otp.findOne({ user: userId, otpHash, purpose });
  if (!record) throw new Error("Invalid or expired OTP");
  record.used = true;
  await record.save();
  return true;
};
