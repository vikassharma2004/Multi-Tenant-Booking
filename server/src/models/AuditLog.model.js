import mongoose from "mongoose";
const AuditSchema = new mongoose.Schema({
actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
action: String,
targetType: String,
target: { type: mongoose.Schema.Types.ObjectId },
}, { timestamps: true });
export const AuditLog = mongoose.model('AuditLog', AuditSchema);