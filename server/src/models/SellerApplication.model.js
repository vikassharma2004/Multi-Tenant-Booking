import mongoose from "mongoose";

const SellerApplicationSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },

  contactEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
    match: [/.+\@.+\..+/, "Invalid email address"]
  },

  contactPhone: {
    type: String,
    required: true,
    trim: true,
    match: [/^[0-9]{10,15}$/, "Phone number must be 10–15 digits"]
  },

  reasonForJoining: {
    type: String,
    trim: true,
    maxlength: 500
  },

  attachments: [{
    publicId: { type: String, required: true },
    url: { type: String, required: true }
  }],

  status: {
    type: String,
    enum: ['submitted', 'in_review', 'accepted', 'rejected'],
    default: 'submitted',
    index: true
  },

  reviewHistory: [{
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, enum: ['accepted', 'rejected'] },
    reason: { type: String, trim: true, maxlength: 500 },
    at: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export const SellerApplication = mongoose.model('SellerApplication', SellerApplicationSchema);
