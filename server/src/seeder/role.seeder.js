import mongoose from "mongoose";
import { RolePermission } from "../models/RolePermission.model.js"; 
import { rolesPermissions } from "../enums/role.enum.js";

const MONGO_URI = "mongodb+srv://vikas:WgrhqNeXhGjrNElr@cluster0.ns0yviu.mongodb.net/Booking?retryWrites=true&w=majority&appName=Cluster0"; // replace

async function seedRolePermissions() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB ✅");

    for (const [role, permissions] of Object.entries(rolesPermissions)) {
      const existing = await RolePermission.findOne({ role });
      if (existing) {
        console.log(`Updating role: ${role}`);
        existing.permissions = permissions;
        await existing.save();
      } else {
        console.log(`Creating role: ${role}`);
        await RolePermission.create({ role, permissions });
      }
    }

    console.log("Role permissions seeding completed ✅");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error ❌", error);
    process.exit(1);
  }
}

seedRolePermissions();
