import mongoose from "mongoose";

const rolePermissionSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    permissions: [
      {
        type: String,
        required: true,
        trim: true
      }
    ]
  },
  {
    timestamps: true
  }
);

export const RolePermission = mongoose.model('RolePermission', rolePermissionSchema);