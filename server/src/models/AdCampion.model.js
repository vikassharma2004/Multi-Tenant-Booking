import mongoose from "mongoose";

const AdCampaignSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true, index: true },
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true, index: true },

  name: { type: String, required: true, trim: true, maxlength: 100 },
  startAt: { type: Date, required: true },
  endAt: { type: Date, required: true },
  budget: { type: Number, required: true, min: 0 },

  status: { type: String, enum: ['running','paused','ended'], default: 'running', index: true },
  priority: { type: Number, default: 0, min: 0 },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

/* Validation: end date must be after start date */
AdCampaignSchema.pre('validate', function(next) {
  if (this.endAt <= this.startAt) {
    return next(new Error('endAt must be after startAt'));
  }
  next();
});

/* Optional: automatically end campaign if past endAt */
AdCampaignSchema.pre('save', function(next) {
  if (this.status === 'running' && new Date() > this.endAt) {
    this.status = 'ended';
  }
  next();
});

/* Index for homepage sorting: prioritize active campaigns with highest priority */
AdCampaignSchema.index({ status: 1, priority: -1, startAt: 1 });

export const AdCampaign = mongoose.model('AdCampaign', AdCampaignSchema);
