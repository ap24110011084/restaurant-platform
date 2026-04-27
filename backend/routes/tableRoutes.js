const express = require("express");
const router = express.Router();
const {
  createTable,
  getAllTables,
  updateTable,
  deleteTable,
  freeTable,
  occupyTable,
} = require("../controllers/tableController");
const { protect, adminOnly, staffOrAdmin } = require("../middleware/authMiddleware");

// Anyone authenticated can view tables
router.get("/", protect, getAllTables);

// Admin only — create, update, delete
router.post("/", protect, adminOnly, createTable);
router.put("/:id", protect, adminOnly, updateTable);
router.delete("/:id", protect, adminOnly, deleteTable);

// Staff or Admin — change table status
router.put("/:id/free", protect, staffOrAdmin, freeTable);
router.put("/:id/occupy", protect, staffOrAdmin, occupyTable);

module.exports = router;