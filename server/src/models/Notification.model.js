import mongoose from "mongoose";
const NotificationSchema = new mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
title: String,
body: String,
link: String,
read: { type: Boolean, default: false },
}, { timestamps: true });
export const Notification = mongoose.model('Notification', NotificationSchema);