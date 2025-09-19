export const Role = {
  // ── Global Admin Roles ──
  superAdmin: "superAdmin",
  adminFinance: "adminFinance",
  adminSupport: "adminSupport",
  adminCompliance: "adminCompliance",
  adminOps: "adminOps",

  // ── Seller Roles ──
  seller: "seller",
  sellerManager: "sellerManager",
  staff: "staff",

  // ── End User ──
  customer: "customer"
};

export const Permission = {
  // ── Booking ──
  createBooking: "createBooking",
  readBooking: "readBooking",
  cancelBooking: "cancelBooking",
  updateBooking: "updateBooking",

  // ── Hotel ──
  addHotel: "addHotel",
  updateHotel: "updateHotel",
  deleteHotel: "deleteHotel",
  shutdownHotel: "shutdownHotel",

  // ── Refund ──
  createRefund: "createRefund",
  approveRefund: "approveRefund",
  rejectRefund: "rejectRefund",
  viewRefunds: "viewRefunds",

  // ── Reports ──
  generateReport: "generateReport",
  viewReport: "viewReport",

  // ── Dashboards ──
  viewAdminDashboard: "viewAdminDashboard",
  viewSellerDashboard: "viewSellerDashboard",

  // ── Security / 2FA ──
  setup2FA: "setup2FA",
  verifyOtp: "verifyOtp",

  // ── Seller Applications ──
  createSellerApplication: "createSellerApplication",
  viewSellerApplication: "viewSellerApplication",
  updateSellerApplication: "updateSellerApplication",
  deleteSellerApplication: "deleteSellerApplication",
  approveSellerApplication: "approveSellerApplication",
  rejectSellerApplication: "rejectSellerApplication",

  // ── User / Tenant Management ──
  manageUsers: "manageUsers",
  manageStaff: "manageStaff",
  manageTenants: "manageTenants",
  manageRoles: "manageRoles",

  // ── Ads & Revenue ──
  manageAds: "manageAds",
  viewRevenue: "viewRevenue"
};

export const rolesPermissions = {
  [Role.superAdmin]: Object.values(Permission), // full access

  [Role.adminFinance]: [
    Permission.viewRevenue,
    Permission.createRefund,
    Permission.approveRefund,
    Permission.rejectRefund,
    Permission.viewReport,
    Permission.viewAdminDashboard
  ],

  [Role.adminSupport]: [
    Permission.readBooking,
    Permission.cancelBooking,
    Permission.viewRefunds,
    Permission.viewSellerApplication,
    Permission.viewAdminDashboard
  ],

  [Role.adminCompliance]: [
    Permission.generateReport,
    Permission.viewReport,
    Permission.viewSellerApplication,
    Permission.updateSellerApplication, // ✅ fixed
    Permission.approveSellerApplication,
    Permission.rejectSellerApplication,
    Permission.viewAdminDashboard
  ],

  [Role.adminOps]: [
    Permission.addHotel,
    Permission.updateHotel,
    Permission.deleteHotel,
    Permission.shutdownHotel,
    Permission.manageUsers,
    Permission.manageStaff,
    Permission.viewAdminDashboard
  ],

  [Role.seller]: [
    // Seller specific
    Permission.addHotel,
    Permission.updateHotel,
    Permission.deleteHotel,
    Permission.shutdownHotel,
    Permission.viewSellerDashboard,
    Permission.viewReport,
    Permission.generateReport,
    Permission.readBooking,
    Permission.manageStaff,
    Permission.createRefund,
    Permission.viewRefunds,

    // Customer abilities
    Permission.createBooking,
    Permission.cancelBooking,
    Permission.setup2FA,
    Permission.verifyOtp,
    Permission.createSellerApplication
  ],

  [Role.sellerManager]: [
    Permission.addHotel,
    Permission.updateHotel,
    Permission.deleteHotel,
    Permission.viewSellerDashboard,
    Permission.viewReport,
    Permission.readBooking,
    Permission.manageStaff,
    Permission.createRefund,
    Permission.viewRefunds,

    // Customer abilities
    Permission.createBooking,
    Permission.cancelBooking,
    Permission.setup2FA,
    Permission.verifyOtp
  ],

  [Role.staff]: [
    Permission.readBooking,
    Permission.updateBooking,
    Permission.cancelBooking,
    Permission.viewRefunds,
    Permission.createRefund,
    Permission.updateHotel
  ],

  [Role.customer]: [
    Permission.createBooking,
    Permission.readBooking,
    Permission.cancelBooking,
    Permission.setup2FA,
    Permission.verifyOtp,
    Permission.createSellerApplication
  ]
};
