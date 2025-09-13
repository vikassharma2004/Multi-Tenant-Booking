import mongoose from "mongoose";
const BookingSchema = new mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true, index: true },
hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
checkIn: { type: Date, required: true, index: true },
checkOut: { type: Date, required: true },
guests: { type: Number, default: 1 },
nights: { type: Number, required: true },
basePrice: { type: Number, required: true },
taxes: { type: Number, default: 0 },
totalPrice: { type: Number, required: true },
currency: { type: String, default: 'INR' },
commissionPercentage: { type: Number, default: 10 },
commissionAmount: { type: Number, default: 0 },
payoutAmount: { type: Number, default: 0 },
paymentStatus: { type: String, enum: ['pending','paid','failed','refunded'], default: 'pending' },
status: { type: String, enum: ['booked','checked_in','checked_out','cancelled'], default: 'booked', index: true },
refund: {
requested: { type: Boolean, default: false },
refundedAmount: { type: Number, default: 0 },
status: { type: String, enum: ['none','pending','processed','rejected'], default: 'none' },
},
}, { timestamps: true });


BookingSchema.pre('save', function(next) {
if (!this.commissionAmount) {
this.commissionAmount = Math.round((this.totalPrice * (this.commissionPercentage / 100)) * 100) / 100;
}
if (!this.payoutAmount) {
this.payoutAmount = Math.round((this.totalPrice - this.commissionAmount - this.taxes) * 100) / 100;
}
next();
});
export const Booking = mongoose.model('Booking', BookingSchema);