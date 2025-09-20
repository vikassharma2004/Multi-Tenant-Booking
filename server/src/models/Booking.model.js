import mongoose from "mongoose";
import { nanoid } from "nanoid";

const RefundSchema = new mongoose.Schema({
  requested: { type: Boolean, default: false },
  amount: { type: Number, default: 0 },
  status: { type: String, enum: ['none', 'pending', 'processed', 'rejected'], default: 'none' },
  method: { type: String }, // e.g. 'upi', 'card', 'bank_transfer'
  transactionId: { type: String },
  processedAt: { type: Date }
}, { _id: false });

const BookingSchema = new mongoose.Schema({
  bookingRef: { type: String, unique: true, default: () => nanoid(8) },

  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true, index: true },
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },

  // Room snapshot (state at booking time)
  room: {
    title: { type: String, required: true },
    roomType: { type: String, enum: ['Classic', 'Luxury', 'Suite'], default: 'Classic' },
    pricePerNight: { type: Number, required: true },
    pricePerGuest: { type: Number, default: 0 }
  },

  checkIn: { type: Date, required: true, index: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, default: 1 },
  nights: { type: Number, required: true },

  // Financials
  subtotal: { type: Number, required: true }, // nights * base price + per guest charges
  taxes: { type: Number, default: 0 },
  totalPrice: { type: Number, required: true },
  currency: { type: String, default: 'INR' },

  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  status: { type: String, enum: ['booked', 'checked_in', 'checked_out', 'cancelled'], default: 'booked', index: true },

  refund: { type: RefundSchema }

}, { timestamps: true });


/* Validation: check-out must be after check-in */
BookingSchema.pre('validate', function (next) {
  if (this.checkOut <= this.checkIn) {
    return next(new Error('Check-out date must be after check-in'));
  }
  next();
});

/* Always recalc commission and payout */
BookingSchema.pre('save', function (next) {
  this.commissionAmount = Math.round((this.totalPrice * (this.commissionPercentage / 100)) * 100) / 100;
  this.payoutAmount = Math.round((this.totalPrice - this.commissionAmount - this.taxes) * 100) / 100;

  // Sanity invariant: payout + commission + taxes = total
  const sum = this.payoutAmount + this.commissionAmount + this.taxes;
  if (Math.abs(sum - this.totalPrice) > 0.01) {
    return next(new Error('Financial calculation mismatch'));
  }
  next();
});

export const Booking = mongoose.model('Booking', BookingSchema);
