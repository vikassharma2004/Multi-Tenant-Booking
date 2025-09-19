// // Example: seller accepted
// await sendEmail({
//   to: "seller@example.com",
//   subject: "Seller Onboarding Accepted",
//   html: templates.sellerOnboardAccepted("John Doe", "https://yourapp.com/dashboard"),
// });
// utils/emailTemplates.js

export const templates = {
  otp: (otp, userName) => `
    <div style="font-family: Arial, sans-serif; line-height:1.5">
      <h2>Hello ${userName || "User"},</h2>
      <p>Your One-Time Password (OTP) is:</p>
      <h1 style="color: #007bff;">${otp}</h1>
      <p>This OTP is valid for 5 minutes. Do not share it with anyone.</p>
      <hr>
      <p>If you did not request this, please ignore this email.</p>
    </div>
  `,

  sellerOnboardAccepted: (sellerName, dashboardLink) => `
    <div style="font-family: Arial, sans-serif; line-height:1.5">
      <h2>Congratulations ${sellerName}!</h2>
      <p>Your seller application has been <strong>accepted</strong>.</p>
      <p>You can now log in to your dashboard and start listing your hotels:</p>
      <a href="${dashboardLink}" style="padding: 10px 15px; background: #007bff; color: white; text-decoration: none;">Go to Dashboard</a>
      <hr>
      <p>If you have any questions, contact our support team.</p>
    </div>
  `,

  sessionLoginAlert: (userName, device, ip, time, location) => `
    <div style="font-family: Arial, sans-serif; line-height:1.5">
      <h2>Hello ${userName},</h2>
      <p>We noticed a new login to your account:</p>
      <ul>
        <li>Device/Browser: ${device}</li>
        <li>IP Address: ${ip}</li>
        <li>Time: ${time}</li>
        <li>Location: ${location}</li>
      </ul>
      <p>If this was you, no action is needed. Otherwise, please secure your account immediately.</p>
      <hr>
      <p>Stay safe,</p>
      <p>YourApp Security Team</p>
    </div>
  `,

  accountSuspended: (userName, reason, supportLink) => `
    <div style="font-family: Arial, sans-serif; line-height:1.5">
      <h2>Dear ${userName},</h2>
      <p>Your account has been <strong>suspended</strong> due to the following reason:</p>
      <p>${reason}</p>
      <p>If you think this is a mistake, please contact support:</p>
      <a href="${supportLink}" style="color:#007bff;">Contact Support</a>
      <hr>
      <p>Regards,</p>
      <p>YourApp Team</p>
    </div>
  `,

  commissionPending: (sellerName, amount, payoutDate, dashboardLink) => `
    <div style="font-family: Arial, sans-serif; line-height:1.5">
      <h2>Hello ${sellerName},</h2>
      <p>You have a pending commission payout:</p>
      <ul>
        <li>Amount: <strong>${amount}</strong></li>
        <li>Expected payout date: <strong>${payoutDate}</strong></li>
      </ul>
      <p>Check your dashboard for more details:</p>
      <a href="${dashboardLink}" style="padding: 10px 15px; background: #007bff; color: white; text-decoration: none;">View Dashboard</a>
      <hr>
      <p>Thank you for partnering with us.</p>
    </div>
  `,

  adPurchaseConfirmation: (sellerName, hotelName, adName, startDate, endDate) => `
    <div style="font-family: Arial, sans-serif; line-height:1.5">
      <h2>Hello ${sellerName},</h2>
      <p>Your ad campaign has been successfully created:</p>
      <ul>
        <li>Hotel: ${hotelName}</li>
        <li>Ad Name: ${adName}</li>
        <li>Start Date: ${startDate}</li>
        <li>End Date: ${endDate}</li>
      </ul>
      <p>Visit your dashboard to monitor performance.</p>
      <hr>
      <p>Thanks,</p>
      <p>YourApp Marketing Team</p>
    </div>
  `,

  passwordReset: (userName, resetLink) => `
    <div style="font-family: Arial, sans-serif; line-height:1.5">
      <h2>Hello ${userName},</h2>
      <p>We received a request to reset your password. Click the link below to reset it:</p>
      <a href="${resetLink}" style="padding: 10px 15px; background: #007bff; color: white; text-decoration: none;">Reset Password</a>
      <hr>
      <p>If you did not request this, please ignore this email.</p>
    </div>
  `,

  genericNotification: (userName, subject, body) => `
    <div style="font-family: Arial, sans-serif; line-height:1.5">
      <h2>Hello ${userName},</h2>
      <p>${body}</p>
      <hr>
      <p>Regards,</p>
      <p>YourApp Team</p>
    </div>
  `
};
