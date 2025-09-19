import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },

  rating: { type: Number, min: 1, max: 5, required: true },
  title: { type: String, trim: true, maxlength: 100 },
  body: { type: String, trim: true, maxlength: 2000 },

  helpfulCount: { type: Number, default: 0 },

  // ✅ prevent spam/fake reviews
  isVerifiedStay: { type: Boolean, default: false }, // only mark true if linked to a Booking
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved', index: true }, // moderation

}, { timestamps: true });

// ✅ Ensure user can only review hotel once
ReviewSchema.index({ user: 1, hotel: 1 }, { unique: true });

export const Review = mongoose.model("Review", ReviewSchema);
