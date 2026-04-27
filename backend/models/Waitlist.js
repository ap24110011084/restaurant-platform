const mongoose = require("mongoose");

// ─── Waitlist Schema ────────────────────────────────────────
const waitlistSchema = new mongoose.Schema(
  {
    // Reference to the user (optional — walk-ins may not have accounts)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Customer name (for walk-ins without accounts)
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    // Contact phone
    phone: {
      type: String,
      default: "",
    },

    // Party size
    guests: {
      type: Number,
      required: [true, "Party size is required"],
      min: 1,
    },

    // Status of this waitlist entry
    status: {
      type: String,
      enum: ["waiting", "seated", "cancelled"],
      default: "waiting",
    },

    // Estimated wait time quoted to customer
    quotedTime: {
      type: String,
      default: "15 mins",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Waitlist", waitlistSchema);