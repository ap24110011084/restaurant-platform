const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// ─── Import Routes ──────────────────────────────────────────
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const tableRoutes = require("./routes/tableRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const waitlistRoutes = require("./routes/waitlistRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const posRoutes = require("./routes/posRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

// ─── Connect Database ───────────────────────────────────────
connectDB();

// ─── Global Middleware ──────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── API Routes ─────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/waitlist", waitlistRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/pos", posRoutes);
app.use("/api/analytics", analyticsRoutes);

// ─── Health Check ───────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    message: "Restaurant Management API is running",
    version: "2.0.0",
    endpoints: [
      "POST /api/auth/register",
      "POST /api/auth/login",
      "GET  /api/auth/profile",
      "PUT  /api/auth/profile",
      "GET  /api/users",
      "PUT  /api/users/:id/role",
      "DELETE /api/users/:id",
      "GET  /api/tables",
      "POST /api/tables",
      "PUT  /api/tables/:id",
      "DELETE /api/tables/:id",
      "PUT  /api/tables/:id/free",
      "PUT  /api/tables/:id/occupy",
      "POST /api/reservations",
      "GET  /api/reservations",
      "GET  /api/reservations/my",
      "PUT  /api/reservations/:id/confirm",
      "PUT  /api/reservations/:id/cancel",
      "PUT  /api/reservations/:id/complete",
      "POST /api/waitlist",
      "GET  /api/waitlist",
      "PUT  /api/waitlist/:id/promote",
      "DELETE /api/waitlist/:id",
      "GET  /api/notifications",
      "PUT  /api/notifications/:id/read",
      "GET  /api/dashboard/stats",
    ],
  });
});

// ─── Error Handler (must be AFTER routes) ───────────────────
app.use(errorHandler);

// ─── Start Server ───────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📡 API Base: http://localhost:${PORT}/api`);
  console.log(`💾 Database: ${process.env.MONGO_URI}\n`);
});