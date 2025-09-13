import mongoose from "mongoose";

const SellerApplicationSchema = new mongoose.Schema({

  ownerName: {
    type: String,
    required: [true, "Owner name is required"],
    trim: true,
    minlength: [2, "Owner name must be at least 2 characters"],
    maxlength: [100, "Owner name must not exceed 100 characters"]
  },
ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  contactEmail: {
    type: String,
    required: [true, "Contact email is required"],
    lowercase: true,
    trim: true,
    index:true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"]
  },

  contactPhone: {
    type: String,
    required: [true, "Contact phone is required"],
    trim: true,
    match: [/^[0-9]{10,15}$/, "Phone number must be between 10 and 15 digits"]
  },


  reasonForJoining: {
    type: String,
    trim: true,
    maxlength: [500, "Reason for joining must not exceed 500 characters"]
  },
  rejectedReason: { type: String, trim: true, maxlength: 500 }
,

  attachments: [{
    type: String,
    trim: true
  }],

  status: {
    type: String,
    enum: ['submitted', 'reviewing', 'pending','accepted', 'rejected'],
    default: 'submitted',
    index: true
  },

  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  reviewedAt: Date

}, { timestamps: true });

export const SellerApplication = mongoose.model('SellerApplication', SellerApplicationSchema);
