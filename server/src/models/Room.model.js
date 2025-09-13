import mongoose from "mongoose";
const RoomSchema = new mongoose.Schema({
hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
title: { type: String, required: true },
description: String,
maxGuests: { type: Number, default: 2 },
price: { type: Number, required: true },
inventory: { type: Number, default: 1 },
photos: [{ url: String }],
amenities: [String],
active: { type: Boolean, default: true },
}, { timestamps: true });

export const Room = mongoose.model('Room', RoomSchema);