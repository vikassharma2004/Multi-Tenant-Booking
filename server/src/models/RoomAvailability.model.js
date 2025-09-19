import mongoose from "mongoose";

const RoomAvailabilitySchema = new mongoose.Schema({
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
  roomTitle: { type: String, required: true }, // reference to room title in Hotel.rooms
  date: { type: Date, required: true, index: true },
  availableRooms: { type: Number, required: true },
  totalRooms: { type: Number, required: true },
}, { timestamps: true });

// Prevent duplicate entries per hotel/room/date
RoomAvailabilitySchema.index({ hotel: 1, roomTitle: 1, date: 1 }, { unique: true });

export const RoomAvailability = mongoose.model("RoomAvailability", RoomAvailabilitySchema);
