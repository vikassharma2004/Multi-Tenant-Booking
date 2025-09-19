import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  reporter: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },

  targetType: { 
    type: String, 
    enum: ['hotel','room','seller','booking','review'], 
    required: true 
  },

  target: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    index: true 
  },

  reasonCode: { 
    type: String, 
    enum: [
      'scam', 
      'spam', 
      'abuse', 
      'fake_listing', 
      'bad_experience', 
      'other'
    ], 
    required: true 
  },

  message: { 
    type: String, 
    maxlength: 1000, 
    trim: true 
  },

  status: { 
    type: String, 
    enum: ['open','in_progress','resolved','dismissed'], 
    default: 'open', 
    index: true 
  },

  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  resolutionNotes: { type: String, maxlength: 1000, trim: true },
  resolvedAt: { type: Date }
}, { timestamps: true });

/* Indexes for admin dashboards */
ReportSchema.index({ targetType: 1, target: 1, status: 1 });
ReportSchema.index({ reporter: 1, targetType: 1, target: 1 }, { unique: true }); 
// ✅ prevents spammy duplicate reports by same user on same target

export const Report = mongoose.model("Report", ReportSchema);
