import mongoose from 'mongoose';
const SellerSchema = new mongoose.Schema({
companyName: { type: String, required: true, trim: true, index: true },
ownerName: { type: String, required: true },
contactEmail: { type: String, required: true, index: true },
contactPhone: { type: String },
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
status: { type: String, enum: ['pending','approved','rejected','suspended'], default: 'pending', index: true },
productType: { type: String },
reasonForJoining: { type: String },
kyc: [{ type: { type: String }, url: { type: String } }],
payout: { bankName: String, accountNumber: String, ifsc: String, upiId: String },
gstNumber: { type: String },
isVerified: { type: Boolean, default: false, index: true },
payoutBalance: { type: Number, default: 0 },
}, { timestamps: true });


SellerSchema.pre('remove', async function(next) {
const Hotel = mongoose.model('Hotel');
await Hotel.updateMany({ seller: this._id }, { $set: { isDeleted: true } });
next();
});
export const Seller = mongoose.model('Seller', SellerSchema);