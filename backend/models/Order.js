const mongoose = require("mongoose");

// ─── Order Schema ───────────────────────────────────────────
const orderSchema = new mongoose.Schema(
  {
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: true,
    },
    items: [
      {
        name: String,
        price: Number,
        quantity: Number,
      }
    ],
    totalAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["open", "paid", "cancelled"],
      default: "open",
    },
    waiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
