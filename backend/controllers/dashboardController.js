const User = require("../models/User");
const Table = require("../models/Table");
const Reservation = require("../models/Reservation");
const Waitlist = require("../models/Waitlist");
const Notification = require("../models/Notification");

// ─── GET /api/dashboard/stats ───────────────────────────────
// Returns role-specific dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const { role } = req.user;

    // ── Admin Stats ─────────────────────────────────────────
    if (role === "admin") {
      const totalUsers = await User.countDocuments();
      const totalTables = await Table.countDocuments();
      const availableTables = await Table.countDocuments({ status: "available" });
      const occupiedTables = await Table.countDocuments({ status: "occupied" });
      const reservedTables = await Table.countDocuments({ status: "reserved" });
      const totalReservations = await Reservation.countDocuments();
      const pendingReservations = await Reservation.countDocuments({ status: "pending" });
      const confirmedReservations = await Reservation.countDocuments({ status: "confirmed" });
      const cancelledReservations = await Reservation.countDocuments({ status: "cancelled" });
      const totalWaitlist = await Waitlist.countDocuments({ status: "waiting" });

      // Revenue mock (in a real app, this would come from orders/payments)
      const completedReservations = await Reservation.countDocuments({ status: "completed" });

      return res.json({
        totalUsers,
        totalTables,
        availableTables,
        occupiedTables,
        reservedTables,
        totalReservations,
        pendingReservations,
        confirmedReservations,
        cancelledReservations,
        completedReservations,
        totalWaitlist,
        tableOccupancyRate: totalTables > 0
          ? Math.round(((occupiedTables + reservedTables) / totalTables) * 100)
          : 0,
      });
    }

    // ── Staff Stats ─────────────────────────────────────────
    if (role === "staff") {
      const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

      const todayReservations = await Reservation.countDocuments({ date: today });
      const pendingReservations = await Reservation.countDocuments({ date: today, status: "pending" });
      const confirmedReservations = await Reservation.countDocuments({ date: today, status: "confirmed" });
      const occupiedTables = await Table.countDocuments({ status: "occupied" });
      const availableTables = await Table.countDocuments({ status: "available" });
      const waitingCustomers = await Waitlist.countDocuments({ status: "waiting" });

      return res.json({
        todayReservations,
        pendingReservations,
        confirmedReservations,
        occupiedTables,
        availableTables,
        waitingCustomers,
      });
    }

    // ── Customer Stats ──────────────────────────────────────
    if (role === "customer") {
      const myReservations = await Reservation.countDocuments({ user: req.user._id });
      const myPending = await Reservation.countDocuments({ user: req.user._id, status: "pending" });
      const myConfirmed = await Reservation.countDocuments({ user: req.user._id, status: "confirmed" });
      const unreadNotifications = await Notification.countDocuments({
        user: req.user._id,
        read: false,
      });

      return res.json({
        myReservations,
        myPending,
        myConfirmed,
        unreadNotifications,
      });
    }

    // Fallback
    res.json({ message: "No stats available for this role" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
