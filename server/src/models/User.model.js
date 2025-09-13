import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  phone: { type: String, index: true },
  username: { type: String, unique: true, sparse: true },
  password: { type: String },
  roles: { type: [String], default: ['user'] },
  isPhoneVerified: { type: Boolean, default: false },
  isEmailVerified: { type: Boolean, default: false },
  twoFA: {
    enabled: { type: Boolean, default: false },
    method: { type: String, enum: ['sms','authenticator','email'], default: 'sms' },
    secret: { type: String }
  },
  sellerProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', index: true },
  isDeleted: { type: Boolean, default: false, index: true },
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function(candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model('User', UserSchema);
