const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/Users');
const Product = require('./models/Product');
const VendingMachine = require('./models/VendingMachine');
const Washroom = require('./models/Washrooms');

const seedData = async () => {
  try {
    const connString = process.env.MONGODB_URI || 'mongodb://localhost:27017/MENSTRUAL_CYCLE_DATA';
    await mongoose.connect(connString);
    console.log('Connected to MongoDB for seeding...');

    const { connectPostgres } = require('./config/postgres');
    await connectPostgres();

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      VendingMachine.deleteMany({}),
      Washroom.deleteMany({})
    ]);

    // 1. Seed Users (using .save() for hooks)
    const userData = [
      { name: 'Admin User', email: 'admin@lunacare.com', password: 'password123', role: 'ADMIN' },
      { name: 'Factory Manager', email: 'producer@lunacare.com', password: 'password123', role: 'PRODUCER' },
      { 
        name: 'Priya Sharma', 
        email: 'priya@example.com', 
        password: 'password123', 
        role: 'CUSTOMER', 
        lunaCoins: 850,
        cycleData: [
          { startDate: '2026-01-15', endDate: '2026-01-20', flowIntensity: 'moderate', symptoms: ['cramps', 'fatigue'], notes: 'Initial cycle' },
          { startDate: '2026-02-12', flowIntensity: 'heavy', symptoms: ['headache'], notes: 'Normal flow' }
        ]
      }
    ];

    for (const u of userData) {
      const user = new User(u);
      await user.save();
    }
    console.log('✓ Users and CycleData synchronized across MongoDB & PostgreSQL');

    // 2. Seed Products
    const products = await Product.insertMany([
      { name: 'Bamboo Soft Pads', description: 'Ultra-soft biodegradable bamboo fiber pads.', category: 'Santary Pads', material: 'Bamboo Fiber', price: 299, stock: 150, biodegradabilityScore: 95 },
      { name: 'Banana Fiber Pads', description: 'Highly absorbent natural banana fiber pads.', category: 'Santary Pads', material: 'Banana Fiber', price: 249, stock: 120, biodegradabilityScore: 98 },
      { name: 'Iron+ Tablets', description: 'Essential iron supplements for menstrual health.', category: 'Tablets', price: 199, stock: 50 },
      { name: 'Complete Health Kit', description: 'A curated kit with pads, supplements, and awareness guide.', category: 'Health Kit', price: 999, stock: 30 }
    ]);

    // 3. Seed Vending Machines
    await VendingMachine.insertMany([
      { machineId: 'VM-001', location: 'Building A, Ground Floor', stockLevel: 45, maxCapacity: 100, status: 'operational' },
      { machineId: 'VM-002', location: 'Building B, Floor 2', stockLevel: 15, maxCapacity: 100, status: 'low-stock' },
      { machineId: 'VM-003', location: 'Staff Canteen', stockLevel: 80, maxCapacity: 100, status: 'operational' }
    ]);

    // 4. Seed Washrooms
    await Washroom.insertMany([
      { washroomId: 'WR-001', location: 'Main Lobby Washroom', airQuality: 85, humidity: 45, temperature: 24, status: 'excellent' },
      { washroomId: 'WR-002', location: 'Factory Floor Washroom', airQuality: 60, humidity: 65, temperature: 28, status: 'needs-cleaning' },
      { washroomId: 'WR-003', location: 'Office Wing Washroom', airQuality: 92, humidity: 40, temperature: 22, status: 'excellent' }
    ]);

    console.log('Database successfully seeded! 🚀');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
