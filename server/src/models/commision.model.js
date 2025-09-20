import mongoose from "mongoose";

const CommissionSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
    unique: true, // one booking → one commission record
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
  },
  amount: {
    type: Number,
    required: true, // how much commission is owed
  },
  percentage: {
    type: Number,
    required: true, // commission percentage (e.g. 10%)
    default:10
  },
  status: {
    type: String,
    enum: ["pending", "due", "paid", "cancelled"],
    default: "pending",
  },
  triggerEvent: {
    type: String,
    enum: ["booking_confirmed", "check_in", "check_out"],
    default: "check_in", // safer to confirm commission only on check-in
  },
  paymentDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

CommissionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export const Commission = mongoose.model("Commission", CommissionSchema);
