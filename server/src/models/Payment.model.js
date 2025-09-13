import mongoose from "mongoose";
const PaymentSchema = new mongoose.Schema({
booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
provider: { type: String, enum: ['razorpay','stripe','paytm','manual','other'], default: 'razorpay' },
providerPaymentId: { type: String },
amount: { type: Number, required: true },
currency: { type: String, default: 'INR' },
fees: { type: Number, default: 0 },
taxes: { type: Number, default: 0 },
status: { type: String, enum: ['initiated','success','failed','refunded'], default: 'initiated' },
}, { timestamps: true });
export const Payment = mongoose.model('Payment', PaymentSchema);