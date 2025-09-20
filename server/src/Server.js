import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import SellerApplicationRouter from './routes/seller.route.js';
import AuthRouter from './routes/user.route.js';
import { errorHandler } from './middleware/ErrorHandler.js';




const app = express();

// Middleware
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(cookieParser());

// Routes
app.use("/api/auth", AuthRouter);
app.use("/api/seller/applications", SellerApplicationRouter);
app.get("/health", (req, res) => res.status(200).json({ message: "Server is healthy" }));

// Global error handler
app.use(errorHandler);

export default app;
