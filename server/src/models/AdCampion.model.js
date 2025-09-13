import mongoose from "mongoose";
const AdCampaignSchema = new mongoose.Schema({
seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true, index: true },
hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },
name: String,
startAt: Date,
endAt: Date,
budget: Number,
status: { type: String, enum: ['running','paused','ended'], default: 'running' },
priority: { type: Number, default: 0 },
}, { timestamps: true });
export const AdCampaign = mongoose.model('AdCampaign', AdCampaignSchema);