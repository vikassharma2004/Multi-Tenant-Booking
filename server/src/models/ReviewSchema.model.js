import mongoose from "mongoose";
const ReviewSchema = new mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
rating: { type: Number, min: 1, max: 5 },
title: String,
body: String,
helpfulCount: { type: Number, default: 0 },
}, { timestamps: true });
export const Review = mongoose.model('Review', ReviewSchema);