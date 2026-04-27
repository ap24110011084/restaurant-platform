const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ─── Protect Route — Require valid JWT ──────────────────────
const protect = async (req, res, next) => {
  try {
    let token;

    // Extract token from "Bearer <token>" header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // No token provided
    if (!token) {
      return res.status(401).json({
        message: "Not authorized, no token provided",
      });
    }

    // Verify token and decode payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (exclude password)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        message: "Not authorized, user not found",
      });
    }

    next();
  } catch (error) {
    res.status(401).json({
      message: "Not authorized, token failed",
    });
  }
};

// ─── Admin Only — Require admin role ────────────────────────
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      message: "Access denied. Admin only.",
    });
  }
};

// ─── Staff or Admin — Require staff or admin role ───────────
const staffOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "staff")) {
    next();
  } else {
    res.status(403).json({
      message: "Access denied. Staff or Admin only.",
    });
  }
};

module.exports = { protect, adminOnly, staffOrAdmin };