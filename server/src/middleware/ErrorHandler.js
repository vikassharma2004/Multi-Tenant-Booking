// error-utils.js (ES Module)
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// ── final error handler -----------------------------------------------------
export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,               
    status: statusCode,
    message,                       // ← send error message
    timestamp: new Date().toISOString()
  });
}
