import mongoose from "mongoose";

const SellerSchema = new mongoose.Schema(
  {
    ownerName: { type: String, required: true, trim: true },
    contactEmail: { type: String, required: true, index: true, lowercase: true },
    contactPhone: { type: String, trim: true },

    // Link back to the user account (1:1)
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

    // Seller lifecycle: all states in one place
    status: {
      type: String,
      enum: ["pending", "approved", "onboarded", "suspended", "rejected"],
      default: "pending",
      index: true
    },

    // KYC documents
    kyc: [
      {
        type: { type: String, trim: true }, // e.g. "PAN", "GST", "Aadhar"
        url: { type: String, required: true }
      }
    ],

    // Payout details
    payout: {
      bankName: { type: String, trim: true },
      accountNumber: { type: String, trim: true },
      ifsc: { type: String, trim: true },
      upiId: { type: String, trim: true }
    },

    gstNumber: { type: String, trim: true },

    // Verification & financials
    isVerified: { type: Boolean, default: false, index: true },
    payoutBalance: { type: Number, default: 0, min: 0 }
  },
  { timestamps: true }
);

/**
 * 🔄 Cascade: When seller is deleted,
 * mark all their hotels as deleted.
 * Note: use findOneAndDelete instead of remove()
 */
SellerSchema.pre("findOneAndDelete", async function (next) {
  const doc = await this.model.findOne(this.getQuery());
  if (doc) {
    const Hotel = mongoose.model("Hotel");
    await Hotel.updateMany({ seller: doc._id }, { $set: { isDeleted: true, deletedAt: new Date() } });
  }
  next();
});

// Index for quick lookups (status + verification)
SellerSchema.index({ status: 1, isVerified: 1 });

export const Seller = mongoose.model("Seller", SellerSchema);
