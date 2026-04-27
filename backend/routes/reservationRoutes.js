const express = require("express");
const router = express.Router();
const {
  createReservation,
  getAllReservations,
  getMyReservations,
  confirmReservation,
  cancelReservation,
  completeReservation,
} = require("../controllers/reservationController");
const { protect, staffOrAdmin } = require("../middleware/authMiddleware");

// Customer creates a reservation
router.post("/", protect, createReservation);

// Customer gets their own reservations
router.get("/my", protect, getMyReservations);

// Staff/Admin gets all reservations
router.get("/", protect, staffOrAdmin, getAllReservations);

// Staff/Admin confirms a reservation
router.put("/:id/confirm", protect, staffOrAdmin, confirmReservation);

// Any authenticated user can cancel (controller enforces ownership for customers)
router.put("/:id/cancel", protect, cancelReservation);

// Staff/Admin completes a reservation
router.put("/:id/complete", protect, staffOrAdmin, completeReservation);

module.exports = router;