const Table = require("../models/Table");

// ─── POST /api/tables ───────────────────────────────────────
// Create a new table (Admin only)
const createTable = async (req, res) => {
  try {
    const { tableNumber, capacity, section } = req.body;

    // Check if table number already exists
    const exists = await Table.findOne({ tableNumber });
    if (exists) {
      return res.status(400).json({ message: "Table number already exists" });
    }

    const table = await Table.create({
      tableNumber,
      capacity,
      section: section || "main",
    });

    res.status(201).json(table);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET /api/tables ────────────────────────────────────────
// Get all tables — supports ?status=available&capacity=4
const getAllTables = async (req, res) => {
  try {
    const { status, capacity, section } = req.query;

    let filter = {};
    if (status) filter.status = status;
    if (capacity) filter.capacity = { $gte: parseInt(capacity) };
    if (section) filter.section = section;

    const tables = await Table.find(filter).sort({ tableNumber: 1 });
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── PUT /api/tables/:id ────────────────────────────────────
// Update a table's details (Admin only)
const updateTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    table.tableNumber = req.body.tableNumber || table.tableNumber;
    table.capacity = req.body.capacity || table.capacity;
    table.status = req.body.status || table.status;
    table.section = req.body.section || table.section;

    const updated = await table.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── DELETE /api/tables/:id ─────────────────────────────────
// Delete a table (Admin only)
const deleteTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    await Table.findByIdAndDelete(req.params.id);
    res.json({ message: "Table deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── PUT /api/tables/:id/free ───────────────────────────────
// Mark table as available (Staff or Admin)
const freeTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    table.status = "available";
    await table.save();

    res.json({ message: "Table is now available", table });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── PUT /api/tables/:id/occupy ─────────────────────────────
// Mark table as occupied (Staff or Admin)
const occupyTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    table.status = "occupied";
    await table.save();

    res.json({ message: "Table is now occupied", table });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTable,
  getAllTables,
  updateTable,
  deleteTable,
  freeTable,
  occupyTable,
};