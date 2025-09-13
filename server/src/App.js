import app from "./Server.js";
import { connectDB, connectRedis} from "./config/db.config.js";
// import ErrorHandler from "./middleware/ErrorHandler.js";


const PORT = process.env.PORT || 5000;

// app.use(ErrorHandler);
app.listen(PORT, () => {
   
  console.log(`Server running on port http://localhost:${PORT}`);
//   connectRedis()
connectDB();
});

app.get("/",(req,res,next)=>{
   res.send("working")
})