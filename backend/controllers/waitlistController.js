const Waitlist = require("../models/Waitlist");
const Table = require("../models/Table");
const Notification = require("../models/Notification");

// ─── POST /api/waitlist ─────────────────────────────────────
// Add a customer to the waitlist
const addToWaitlist = async (req, res) => {
  try {
    const { name, phone, guests, quotedTime } = req.body;

    const entry = await Waitlist.create({
      user: req.user ? req.user._id : null,
      name: name || (req.user ? req.user.name : "Walk-in"),
      phone: phone || "",
      guests,
      quotedTime: quotedTime || "15 mins",
    });

    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET /api/waitlist ──────────────────────────────────────
// Get all waitlist entries (Staff/Admin) — supports ?status=waiting
const getWaitlist = async (req, res) => {
  try {
    const { status } = req.query;

    let filter = {};
    if (status) filter.status = status;

    const waitlist = await Waitlist.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: 1 }); // FIFO order

    res.json(waitlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── PUT /api/waitlist/:id/promote ──────────────────────────
// Seat the customer — find available table and mark seated
const promoteWaitlist = async (req, res) => {
  try {
    const entry = await Waitlist.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: "Waitlist entry not found" });
    }

    if (entry.status !== "waiting") {
      return res.status(400).json({ message: "Customer is not in 'waiting' status" });
    }

    // Find a suitable available table
    const table = await Table.findOne({
      status: "available",
      capacity: { $gte: entry.guests },
    }).sort({ capacity: 1 });

    if (!table) {
      return res.status(400).json({ message: "No suitable table available right now" });
    }

    // Mark table as occupied
    table.status = "occupied";
    await table.save();

    // Mark waitlist entry as seated
    entry.status = "seated";
    await entry.save();

    // Notify user if they have an account
    if (entry.user) {
      await Notification.create({
        user: entry.user,
        title: "You've Been Seated!",
        message: `Your table (${table.tableNumber}) is ready. Party of ${entry.guests}.`,
        type: "waitlist",
      });
    }

    res.json({
      message: `${entry.name} seated at table ${table.tableNumber}`,
      entry,
      table,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── DELETE /api/waitlist/:id ───────────────────────────────
// Remove a customer from the waitlist
const removeFromWaitlist = async (req, res) => {
  try {
    const entry = await Waitlist.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: "Waitlist entry not found" });
    }

    await Waitlist.findByIdAndDelete(req.params.id);
    res.json({ message: "Removed from waitlist" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addToWaitlist,
  getWaitlist,
  promoteWaitlist,
  removeFromWaitlist,
};