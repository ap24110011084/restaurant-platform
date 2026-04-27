const mongoose = require("mongoose");

// ─── Notification Schema ────────────────────────────────────
const notificationSchema = new mongoose.Schema(
  {
    // User who receives this notification
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Notification title
    title: {
      type: String,
      required: true,
    },

    // Notification message body
    message: {
      type: String,
      required: true,
    },

    // Type of notification for frontend icon/color
    type: {
      type: String,
      enum: ["reservation", "waitlist", "system", "info"],
      default: "info",
    },

    // Read status
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
