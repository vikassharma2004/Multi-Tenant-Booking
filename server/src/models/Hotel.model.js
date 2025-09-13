import mongoose from 'mongoose';
const HotelSchema = new mongoose.Schema({
seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true, index: true },
name: { type: String, required: true },
slug: { type: String, index: true },
description: { type: String },
address: { type: String },
location: { type: { type: String, default: 'Point' }, coordinates: { type: [Number], default: [0,0] } },
images: [{ url: String, caption: String }],
amenities: [String],
rating: { type: Number, default: 0, index: true },
ratingCount: { type: Number, default: 0 },
isVerified: { type: Boolean, default: false, index: true },
isFeatured: { type: Boolean, default: false },
isPaidPlacement: { type: Boolean, default: false },
paidPlacementUntil: { type: Date },
}, { timestamps: true });
HotelSchema.index({ location: '2dsphere' });
HotelSchema.index({ name: 'text', description: 'text', amenities: 'text' });

export const Hotel = mongoose.model('Hotel', HotelSchema);