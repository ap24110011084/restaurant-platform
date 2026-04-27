require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Table = require('./models/Table');
const Reservation = require('./models/Reservation');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/restaurantDB');
    console.log('MongoDB Connected for Seeding...');

    await User.deleteMany();
    await Table.deleteMany();
    await Reservation.deleteMany();

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@restomanage.com',
      password: 'password123',
      role: 'admin',
      phone: '555-0000',
    });

    const staff = await User.create({
      name: 'Staff Member',
      email: 'staff@restomanage.com',
      password: 'password123',
      role: 'staff',
      phone: '555-1111',
    });

    const customer = await User.create({
      name: 'Jane Doe',
      email: 'customer@test.com',
      password: 'password123',
      role: 'customer',
      phone: '555-2222',
    });

    // Create Tables
    const tables = await Table.create([
      { tableNumber: '101', capacity: 2, section: 'main', x: 20, y: 30 },
      { tableNumber: '102', capacity: 4, section: 'main', x: 40, y: 30 },
      { tableNumber: '103', capacity: 4, section: 'main', x: 60, y: 30 },
      { tableNumber: '104', capacity: 6, section: 'window', x: 20, y: 60 },
      { tableNumber: '201', capacity: 2, section: 'patio', x: 80, y: 60 },
      { tableNumber: 'V1', capacity: 8, section: 'vip', x: 50, y: 80 },
    ]);

    // Create Reservations
    await Reservation.create({
      user: customer._id,
      customerName: customer.name,
      guests: 4,
      date: new Date().toISOString().split('T')[0], // Today
      time: '19:00',
      status: 'pending',
      notes: 'Anniversary dinner'
    });

    await Reservation.create({
      user: customer._id,
      customerName: 'Guest User', // Non-registered walkin/call
      guests: 2,
      date: new Date().toISOString().split('T')[0], // Today
      time: '20:00',
      status: 'confirmed',
      table: tables[0]._id
    });

    console.log('Database Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error('Seeding Failed Error Message:', error.message);
    if (error.errors) {
      console.error('Validation Errors:', JSON.stringify(error.errors, null, 2));
    }
    console.error('Stack Trace:', error.stack);
    process.exit(1);
  }
};

seedDB();
