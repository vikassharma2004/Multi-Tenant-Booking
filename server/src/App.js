import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import app from "./Server.js";
import { connectDB, connectRedis } from './config/db.config.js';
import './automations/SellerApplication.Automation.js';
import { initSocket } from './config/socket.config.js';

const PORT = process.env.PORT || 5001;

// Global error logging (won’t crash app)
process.on('unhandledRejection', (err) => console.error('Unhandled Rejection:', err));
process.on('uncaughtException', (err) => console.error('Uncaught Exception:', err));

async function startServer() {
  try {
    await connectDB();      // Connect MongoDB first
    // await connectRedis();   // Then Redis
 const server = http.createServer(app);

    // Initialize Socket.IO
    initSocket(server);
     server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1); // Optional: exit if DB/Redis fails
  }
}

startServer();
