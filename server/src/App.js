import app from "./Server.js";
import { connectDB, connectRedis} from "./config/db.config.js";
import { AppError, errorHandler } from "./middleware/ErrorHandler.js";
import SellerApplicationRouter from "./routes/seller.route.js";
import AuthRouter from "./routes/user.route.js";


const PORT = process.env.PORT || 5001;


app.listen(PORT, () => {
   
  console.log(`Server running on port http://localhost:${PORT}`);
//   connectRedis()
connectDB();
});
// routes 
app.use("/api/auth", AuthRouter);
app.use("/api/seller/applications",SellerApplicationRouter);


app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy" });
});

app.use(errorHandler)