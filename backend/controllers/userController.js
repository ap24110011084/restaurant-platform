const User = require("../models/User");

// ─── GET /api/users ─────────────────────────────────────────
// Get all users (Admin only) — supports ?search=query
const getAllUsers = async (req, res) => {
  try {
    const { search } = req.query;

    // Build filter — search by name or email
    let filter = {};
    if (search) {
      filter = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── PUT /api/users/:id/role ────────────────────────────────
// Change a user's role (Admin only)
const changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    // Validate role
    if (!["admin", "staff", "customer"].includes(role)) {
      return res.status(400).json({ message: "Invalid role. Use: admin, staff, or customer" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent admin from changing their own role
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot change your own role" });
    }

    user.role = role;
    await user.save();

    res.json({
      message: `User role updated to ${role}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── DELETE /api/users/:id ──────────────────────────────────
// Delete a user (Admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot delete your own account" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUsers, changeUserRole, deleteUser };
