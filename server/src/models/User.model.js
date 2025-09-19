import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },

    avatar: {
      url: {
        type: String,
        default:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbi1fPLVLMrCsyYV1YbbtHw__IreCjAQBGsw&s"
      },
      public_id: { type: String, default: "" }
    },

    phone: {
      type: String,
      index: true
    },

    username: {
      type: String,
      unique: true,
      sparse: true, // allows multiple docs without username
      index: true,
      lowercase: true
    },

    password: { type: String, required: true },

    userType: {
      type: String,
      enum: [
        "seller",
        "customer",
        "superAdmin",
        "adminFinance",
        "adminSupport",
        "adminCompliance",
        "adminOps",
        "sellerManager",
        "staff"
      ],
      default: "customer",
      index: true
    },

    isPhoneVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },

    role: {
      type: mongoose.Schema.Types.ObjectId, // ✅ fixed capital T
      ref: "RolePermission",
      required: true
    },

    twoFA: {
      enabled: { type: Boolean, default: false },
      method: {
        type: String,
        enum: ["sms", "authenticator", "email"],
        default: "authenticator"
      },
      secret: { type: String }
    },

    sellerProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      index: true
    },

    isDeleted: { type: Boolean, default: false, index: true },
    isSuspended: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

// For frequent queries like active sellers/customers
UserSchema.index({ userType: 1, isDeleted: 1 });

// For fetching users by phone if not deleted
UserSchema.index({ phone: 1, isDeleted: 1 });

// For analytics and sorting by recent signups
UserSchema.index({ createdAt: -1 });

// Hash password before save
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model("User", UserSchema);
