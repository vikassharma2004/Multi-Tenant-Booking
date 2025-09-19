import mongoose from "mongoose";

const SavedHotelSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
}, { timestamps: true });

// Prevent duplicates
SavedHotelSchema.index({ user: 1, hotel: 1 }, { unique: true });

export const SavedHotel = mongoose.model("SavedHotel", SavedHotelSchema);
