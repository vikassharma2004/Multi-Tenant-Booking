import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { 
    type: String, 
    enum: ['booking', 'promotion', 'system', 'review', 'other'], 
    default: 'other',
    index: true
  },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  body: { type: String, required: true, trim: true, maxlength: 2000 },
  link: { type: String, trim: true },
  read: { type: Boolean, default: false, index: true },
  archived: { type: Boolean, default: false, index: true }, // optional soft-delete
  expiresAt: { type: Date } // optional TTL for promotional notifications
}, { timestamps: true });

/* TTL index if expiresAt is set (optional) */
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Compound index for quick unread fetch per user
NotificationSchema.index({ user: 1, read: 1, archived: 1 });

export const Notification = mongoose.model('Notification', NotificationSchema);
