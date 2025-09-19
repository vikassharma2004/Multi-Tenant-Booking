import cron from 'node-cron';

import { SellerApplication } from '../models/SellerApplication.model.js';
import { User } from '../models/User.model.js';
import { Seller } from '../models/Seller.model.js';
import { RolePermission } from '../models/RolePermission.model.js';

// Cron 1: Move submitted → reviewing every 3 minutes
cron.schedule('*/3 * * * *', async () => {
  try {
    console.log('Running cron: submitted → reviewing');
    const apps = await SellerApplication.find({ status: 'submitted' });
    for (let app of apps) {
      app.status = 'reviewing';
      app.reviewedAt = new Date();
      await app.save();
      console.log(`Application ${app._id} moved to reviewing`);
    }
  } catch (err) {
    console.error('Error in cron reviewing:', err);
  }
});

// Cron 2: Move reviewing → accepted every 3 minutes
cron.schedule('*/3 * * * *', async () => {
  try {
    console.log('Running cron: reviewing → accepted');
    const apps = await SellerApplication.find({ status: 'reviewing' });

    for (let app of apps) {
      // Get seller role
      const sellerRole = await RolePermission.findOne({ name: 'seller' });
      if (!sellerRole) {
        console.error('Seller role not found, skipping application', app._id);
        continue;
      }

      // Get user
      const user = await User.findById(app.ownerId);
      if (!user) {
        console.error('User not found, skipping application', app._id);
        continue;
      }

      // Check if already seller
      if (user.sellerProfile) {
        console.log(`User ${user._id} already has seller profile, skipping`);
        continue;
      }

      // Create seller profile
      const seller = await Seller.create({
        ownerName: app.ownerName,
        contactEmail: app.contactEmail,
        contactPhone: app.contactPhone,
        user: user._id,
      });

      // Update user
      user.userType = 'seller';
      user.role = sellerRole._id;
      user.sellerProfile = seller._id;
      await user.save();

      // Update application
      app.status = 'accepted';
      app.reviewedAt = new Date();
      await app.save();

      console.log(`Application ${app._id} accepted and seller profile created`);
    }
  } catch (err) {
    console.error('Error in cron accepting:', err);
  }
});
