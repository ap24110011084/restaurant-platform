const mongoose = require("mongoose");

// ─── Reservation Schema ─────────────────────────────────────
const reservationSchema = new mongoose.Schema(
  {
    // Reference to the user who made the reservation
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Reference to the assigned table (null if pending assignment)
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      default: null,
    },

    // Guest name (for display, may differ from user name)
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },

    // Number of guests
    guests: {
      type: Number,
      required: [true, "Number of guests is required"],
      min: 1,
    },

    // Reservation date (stored as string "YYYY-MM-DD")
    date: {
      type: String,
      required: [true, "Date is required"],
    },

    // Reservation time (stored as string "HH:MM")
    time: {
      type: String,
      required: [true, "Time is required"],
    },

    // Reservation status
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },

    // Optional notes from customer
    notes: {
      type: String,
      default: "",
    },

    // Phone number for contact
    phone: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);