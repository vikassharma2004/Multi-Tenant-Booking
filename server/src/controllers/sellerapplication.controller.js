import { createSellerApplication, getUserApplications, getApplicationById, getAllApplications, UpdateApplication } from "../services/sellerApplication.service.js";
import { catchAsyncError } from "../middleware/handleasyncerror.js";
import { sellerApplicationValidator } from "../validators/sellervalidators.js";
import { AppError } from "../middleware/ErrorHandler.js";

export const CreateSellerApplicationController = catchAsyncError(async (req, res) => {
  const userId = req.user._id;
  const { error, value } = sellerApplicationValidator.validate(req.body, { abortEarly: false });

  if (error) {
    // Collect all error messages
    const messages = error.details.map((err) => err.message);
    throw new AppError(messages.join(", "), 400);
  }

  const application = await createSellerApplication(userId, value);

  res.status(201).json({
    message: "Seller application submitted successfully",
    application
  });
});

export const GetUserApplicationsController = catchAsyncError(async (req, res) => {
   const userId=req.user._id
  const applications = await getUserApplications(userId);

  res.json(applications);
});

export const GetApplicationByIdController = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const application = await getApplicationById(id);

  res.json(application );
});

export const GetAllApplicationController = catchAsyncError(async (req, res) => {
    const { status, email, page=1, limit=10 } = req.query;

    const data = await getAllApplications({
        status,
        email,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
    });

    res.json({ success: true, ...data });
});

export const UpdateApplicationController = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const { status, rejectedReason } = req.body || {};
  const adminId = req.user._id;
  if(!status || req.body=="undefined") throw new AppError("Status is required", 400);
  if(status === "rejected" && !rejectedReason) throw new AppError("Rejected reason is required", 400);

  const application = await UpdateApplication(id, adminId, status, rejectedReason);

  res.json({ message:`application ${status} successfully`, application });
});
