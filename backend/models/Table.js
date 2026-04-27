const mongoose = require("mongoose");

// ─── Table Schema ───────────────────────────────────────────
const tableSchema = new mongoose.Schema(
  {
    tableNumber: {
      type: String,
      required: [true, "Table number is required"],
      unique: true,
      trim: true,
    },

    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: 1,
    },

    status: {
      type: String,
      enum: ["available", "reserved", "occupied"],
      default: "available",
    },

    section: {
      type: String,
      enum: ["main", "patio", "window", "vip", "bar"],
      default: "main",
    },

    // Visual coordinates for floor plan (0-100 percentage)
    x: {
      type: Number,
      default: 0,
    },
    y: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Table", tableSchema);