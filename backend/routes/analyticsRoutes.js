const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @desc    Get detailed analytics for Spice Hub
// @route   GET /api/analytics
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const totalReservations = await Reservation.countDocuments();
    const completedReservations = await Reservation.countDocuments({ status: 'completed' });
    const cancelledReservations = await Reservation.countDocuments({ status: 'cancelled' });
    
    // Calculate No-Show Rate (Cancelled / Total)
    const noShowRate = totalReservations > 0 
      ? Math.round((cancelledReservations / totalReservations) * 100) 
      : 0;

    // Mock Turnover Rate (Completed / Available Hours)
    const turnoverRate = 3.2; // tables per shift

    // Mock Peak Hours (based on 3-tier distribution)
    const peakHours = [
      { name: '17:00', total: 12 },
      { name: '18:00', total: 25 },
      { name: '19:00', total: 42 },
      { name: '20:00', total: 38 },
      { name: '21:00', total: 20 },
      { name: '22:00', total: 5 },
    ];

    // Weekly Revenue from paid orders
    const orders = await Order.find({ status: 'paid' });
    const totalRevenue = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);

    const revenueByDay = [
      { name: 'Mon', total: 4200 },
      { name: 'Tue', total: 3800 },
      { name: 'Wed', total: 4500 },
      { name: 'Thu', total: 5120 },
      { name: 'Fri', total: 8400 },
      { name: 'Sat', total: 9600 },
      { name: 'Sun', total: 7200 },
    ];

    res.json({
      noShowRate,
      turnoverRate,
      peakHours,
      revenueByDay,
      totalRevenue: totalRevenue || 42820 // Mock if no paid orders yet
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
