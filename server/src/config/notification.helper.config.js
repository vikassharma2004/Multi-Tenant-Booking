import { getIO } from "./socket.config.js";

/**
 * Send notification to a single user
 * @param {mongoose.Types.ObjectId} userId
 * @param {Object} payload - { title, body, link }
 */
export function sendNotification(userId, payload) {
  try {
    const io = getIO();
    io.to(userId.toString()).emit("notification", payload);
    console.log(`Notification sent to user ${userId}`);
  } catch (err) {
    console.error("Socket notification failed:", err);
  }
}

/**
 * Broadcast notification to all connected users
 */
export function broadcastNotification(payload) {
  try {
    const io = getIO();
    io.emit("notification", payload);
    console.log("Broadcast notification sent");
  } catch (err) {
    console.error("Socket broadcast failed:", err);
  }
}
