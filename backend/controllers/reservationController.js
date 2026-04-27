const Reservation = require("../models/Reservation");
const Table = require("../models/Table");
const Notification = require("../models/Notification");

// ─── POST /api/reservations ─────────────────────────────────
// Create a new reservation
const createReservation = async (req, res) => {
  try {
    const { customerName, guests, date, time, notes, phone, tableId } = req.body;

    let assignedTable = null;

    // If a specific table was requested, check if it's available
    if (tableId) {
      const table = await Table.findById(tableId);
      if (!table) {
        return res.status(404).json({ message: "Table not found" });
      }
      if (table.status !== "available") {
        return res.status(400).json({ message: "Table is not available" });
      }
      assignedTable = table._id;

      // Mark table as reserved
      table.status = "reserved";
      await table.save();
    } else {
      // Auto-assign: find first available table that fits the party
      const available = await Table.findOne({
        status: "available",
        capacity: { $gte: guests },
      }).sort({ capacity: 1 }); // Pick smallest table that fits

      if (available) {
        assignedTable = available._id;
        available.status = "reserved";
        await available.save();
      }
      // If no table found, reservation is created as "pending" without a table
    }

    const reservation = await Reservation.create({
      user: req.user._id,
      table: assignedTable,
      customerName: customerName || req.user.name,
      guests,
      date,
      time,
      notes: notes || "",
      phone: phone || "",
      status: assignedTable ? "confirmed" : "pending",
    });

    // Populate table info before returning
    const populated = await Reservation.findById(reservation._id)
      .populate("table", "tableNumber capacity section")
      .populate("user", "name email");

    // Create notification for the user
    await Notification.create({
      user: req.user._id,
      title: assignedTable ? "Reservation Confirmed" : "Reservation Pending",
      message: assignedTable
        ? `Your reservation for ${guests} guests on ${date} at ${time} has been confirmed.`
        : `Your reservation for ${guests} guests on ${date} at ${time} is pending table assignment.`,
      type: "reservation",
    });

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET /api/reservations ──────────────────────────────────
// Get all reservations (Staff/Admin) — supports ?status=pending&date=2026-05-01
const getAllReservations = async (req, res) => {
  try {
    const { status, date, search } = req.query;

    let filter = {};
    if (status) filter.status = status;
    if (date) filter.date = date;
    if (search) {
      filter.customerName = { $regex: search, $options: "i" };
    }

    const reservations = await Reservation.find(filter)
      .populate("table", "tableNumber capacity section")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET /api/reservations/my ───────────────────────────────
// Get current user's reservations only
const getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate("table", "tableNumber capacity section")
      .sort({ createdAt: -1 });

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── PUT /api/reservations/:id/confirm ──────────────────────
// Confirm a pending reservation (Staff/Admin)
const confirmReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (reservation.status !== "pending") {
      return res.status(400).json({ message: "Only pending reservations can be confirmed" });
    }

    // If no table assigned yet, try to auto-assign
    if (!reservation.table) {
      const available = await Table.findOne({
        status: "available",
        capacity: { $gte: reservation.guests },
      }).sort({ capacity: 1 });

      if (!available) {
        return res.status(400).json({ message: "No suitable table available to confirm" });
      }

      available.status = "reserved";
      await available.save();
      reservation.table = available._id;
    }

    reservation.status = "confirmed";
    await reservation.save();

    // Notify the customer
    await Notification.create({
      user: reservation.user,
      title: "Reservation Confirmed",
      message: `Your reservation on ${reservation.date} at ${reservation.time} has been confirmed!`,
      type: "reservation",
    });

    const populated = await Reservation.findById(reservation._id)
      .populate("table", "tableNumber capacity section")
      .populate("user", "name email");

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── PUT /api/reservations/:id/cancel ───────────────────────
// Cancel a reservation (any authenticated user — customer cancels own, staff/admin can cancel any)
const cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Customers can only cancel their own reservations
    if (
      req.user.role === "customer" &&
      reservation.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "You can only cancel your own reservations" });
    }

    if (reservation.status === "cancelled") {
      return res.status(400).json({ message: "Reservation is already cancelled" });
    }

    // Free the table if one was assigned
    if (reservation.table) {
      await Table.findByIdAndUpdate(reservation.table, { status: "available" });
    }

    reservation.status = "cancelled";
    await reservation.save();

    // Notify the customer
    await Notification.create({
      user: reservation.user,
      title: "Reservation Cancelled",
      message: `Your reservation on ${reservation.date} at ${reservation.time} has been cancelled.`,
      type: "reservation",
    });

    res.json({ message: "Reservation cancelled", reservation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── PUT /api/reservations/:id/complete ─────────────────────
// Mark reservation as completed (Staff/Admin) — frees table
const completeReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (reservation.status !== "confirmed") {
      return res.status(400).json({ message: "Only confirmed reservations can be completed" });
    }

    // Free the table
    if (reservation.table) {
      await Table.findByIdAndUpdate(reservation.table, { status: "available" });
    }

    reservation.status = "completed";
    await reservation.save();

    res.json({ message: "Reservation completed", reservation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReservation,
  getAllReservations,
  getMyReservations,
  confirmReservation,
  cancelReservation,
  completeReservation,
};