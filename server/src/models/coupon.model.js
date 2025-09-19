import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  description: { type: String },
  discountType: { type: String, enum: ['flat','percentage'], required: true },
  discountValue: { type: Number, required: true },
  minBookingAmount: { type: Number, default: 0 },
  maxUsage: { type: Number, default: 1 },
  usedCount: { type: Number, default: 0 },
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  applicableHotels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' }],
  status: { type: String, enum: ['active','expired','disabled'], default: 'active' }
}, { timestamps: true });

export const Coupon = mongoose.model("Coupon", CouponSchema);
