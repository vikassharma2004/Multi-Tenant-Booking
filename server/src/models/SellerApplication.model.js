import mongoose from "mongoose";
const SellerApplicationSchema = new mongoose.Schema({
companyName: String,
ownerName: String,
contactEmail: String,
contactPhone: String,
productType: String,
reasonForJoining: String,
attachments: [String],
status: { type: String, enum: ['submitted','reviewing','accepted','rejected'], default: 'submitted', index: true },
reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
reviewedAt: Date,
}, { timestamps: true });
export const SellerApplication = mongoose.model('SellerApplication', SellerApplicationSchema);