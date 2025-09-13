import mongoose from "mongoose";
const ReportSchema = new mongoose.Schema({
reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
targetType: { type: String, enum: ['hotel','room','seller','booking','review'] },
target: { type: mongoose.Schema.Types.ObjectId },
message: String,
status: { type: String, enum: ['open','in_progress','resolved','dismissed'], default: 'open' },
assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
export const Report = mongoose.model('Report', ReportSchema);