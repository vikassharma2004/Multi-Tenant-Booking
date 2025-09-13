import mongoose from "mongoose";
const ResetTokenSchema = new mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
tokenHash: { type: String, required: true },
createdAt: { type: Date, default: Date.now, index: true },
});
ResetTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });


ResetTokenSchema.statics.createTokenFor = async function(userId) {
const token = crypto.randomBytes(32).toString('hex');
const hash = crypto.createHash('sha256').update(token).digest('hex');
await this.create({ user: userId, tokenHash: hash });
return token;
};
export const ResetToken=mongoose.model("resettoken",ResetTokenSchema)