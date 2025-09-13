export const catchAsyncError = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) =>
      res.status(500).json({ success: false, message: err.message })
    );
  };
};
