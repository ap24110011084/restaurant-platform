const express = require("express");
const router = express.Router();
const {
  addToWaitlist,
  getWaitlist,
  promoteWaitlist,
  removeFromWaitlist,
} = require("../controllers/waitlistController");
const { protect, staffOrAdmin } = require("../middleware/authMiddleware");

// Any authenticated user can join the waitlist
router.post("/", protect, addToWaitlist);

// Staff/Admin can view the waitlist
router.get("/", protect, staffOrAdmin, getWaitlist);

// Staff/Admin can seat (promote) a waitlisted customer
router.put("/:id/promote", protect, staffOrAdmin, promoteWaitlist);

// Staff/Admin can remove from waitlist
router.delete("/:id", protect, staffOrAdmin, removeFromWaitlist);

module.exports = router;