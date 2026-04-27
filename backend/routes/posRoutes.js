const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Table = require('../models/Table');
const { protect, staffOrAdmin } = require('../middleware/authMiddleware');

// @desc    Get order for a table
// @route   GET /api/pos/table/:tableId
router.get('/table/:tableId', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ table: req.params.tableId, status: 'open' })
      .populate('table');
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create/Update order
// @route   POST /api/pos/table/:tableId
router.post('/table/:tableId', protect, async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    let order = await Order.findOne({ table: req.params.tableId, status: 'open' });

    if (order) {
      order.items = items;
      order.totalAmount = totalAmount;
      await order.save();
    } else {
      order = await Order.create({
        table: req.params.tableId,
        items,
        totalAmount,
        waiter: req.user._id
      });
      // Mark table as occupied if it wasn't already
      await Table.findByIdAndUpdate(req.params.tableId, { status: 'occupied' });
    }
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Close order (Pay)
// @route   PUT /api/pos/:id/pay
router.put('/:id/pay', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = 'paid';
    await order.save();

    // Free the table
    await Table.findByIdAndUpdate(order.table, { status: 'available' });

    res.json({ message: 'Order paid and table freed', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
