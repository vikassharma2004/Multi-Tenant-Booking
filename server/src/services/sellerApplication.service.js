import { Seller } from "../models/Seller.model.js";
import { SellerApplication } from "../models/SellerApplication.model.js";
import { AppError } from "../middleware/ErrorHandler.js";
import { User } from "../models/User.model.js";


export const createSellerApplication = async (userId, data) => {

    // check if seller account exit for this email 
    const existingseller=await Seller.findOne({contactEmail:data.contactEmail ,user:userId})
    if(existingseller) throw new AppError("You already have a seller account", 400);

  // Check if the user already has a pending application
  const existing = await SellerApplication.findOne({
    _id: { $ne: null },
    ownerId: userId,
    status: { $in: ["submitted", "reviewing" ,"rejected","submitted"] }
  });

  if (existing) throw new AppError(`You already have a  application in ${existing.status} status`, 400);

  const application = await SellerApplication.create({
    ownerId: userId,
    ...data
  });

  return application;
};


export const getUserApplications = async (userId) => {
    console.log("getUserApplications")
  const applications = await SellerApplication.findOne({ ownerId: userId });
  return applications;
};


export const getApplicationById = async (id) => {
  const application = await SellerApplication.findById(id).populate("reviewedBy", "name email");
  if (!application) throw new AppError("Application not found", 404);
  return application;
};


export const getAllApplications = async ({ status, email, page = 1, limit = 10 }) => {
    const query = {};

    if (status) query.status = status;
    if (email) query.contactEmail = { $regex: email, $options: "i" }; // case-insensitive search

    const skip = (page - 1) * limit;

    const applications = await SellerApplication.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const total = await SellerApplication.countDocuments(query);

    return { applications, total, page, limit, totalPages: Math.ceil(total / limit) };
};
export const UpdateApplication = async (id, adminId, status, rejectedReason) => {
  const application = await SellerApplication.findById(id);
  if (!application) throw new AppError("Application not found", 404);

  if (!["accepted", "rejected" ,"pending","reviewing"].includes(status))
    throw new AppError("Invalid status", 400);

  application.status = status;
  application.reviewedBy = adminId;
  application.reviewedAt = new Date();

  if (status === "rejected") application.rejectedReason = rejectedReason;
// if accepted create an seller account and share id pass to user 
  if(status === "accepted"){
    const user=await User.findById(application.ownerId);
const seller=await Seller.create({
  ownerName:application.ownerName,
  contactEmail:application.contactEmail,
  contactPhone:application.contactPhone,
  user:application.ownerId,
})
user.sellerProfile=seller._id;
user.UserType="seller"
await user.save();
console.log("seller rpofikle creeated")

  }

  await application.save();
  return application;
};
