import { Server } from "socket.io";

let io;

/**
 * Initialize Socket.IO
 * @param {http.Server} server
 */
export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*", // restrict to your frontend domain in production
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Listen to join event to assign user to their room
    socket.on("join", (userId) => {
      socket.join(userId.toString());
      console.log(`User ${userId} joined room ${userId}`);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
}

/**
 * Get io instance
 */
export function getIO() {
  if (!io) throw new Error("Socket.io not initialized. Call initSocket first.");
  return io;
}
