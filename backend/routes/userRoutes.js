const express = require("express");
const router = express.Router();
const { getAllUsers, changeUserRole, deleteUser } = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// All user management routes require admin
router.get("/", protect, adminOnly, getAllUsers);
router.put("/:id/role", protect, adminOnly, changeUserRole);
router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;
