import mongoose from "mongoose";

const PaymentTransactionSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  paymentMethod: { type: String, enum: ['card','upi','wallet','netbanking','paypal'], required: true },
  paymentGatewayId: { type: String }, // from payment provider
  status: { type: String, enum: ['pending','paid','failed','refunded'], default: 'pending' },
  refundedAmount: { type: Number, default: 0 },
  metadata: { type: mongoose.Schema.Types.Mixed } // any extra info
}, { timestamps: true });

export const PaymentTransaction = mongoose.model('PaymentTransaction', PaymentTransactionSchema);
