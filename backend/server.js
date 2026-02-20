require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { connectDatabase } = require('./config/database');
const { connectPostgres } = require('./config/postgres');
const { connectMQTT } = require('./config/mqtt');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later'
});

app.use('/api/', limiter);

// Request logging in development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Routes
const authRoutes = require('./routes/auth');
const vendingRoutes = require('./routes/vendingMachines');
const washroomRoutes = require('./routes/washrooms');
const ecommerceRoutes = require('./routes/ecommerce');
const iotRoutes = require('./routes/iot');
const healthcareRoutes = require('./routes/healthcare');
const chatbotRoutes = require('./routes/chatbot');

app.use('/api/auth', authRoutes);
app.use('/api/vending-machines', vendingRoutes);
app.use('/api/washrooms', washroomRoutes);
app.use('/api/ecommerce', ecommerceRoutes);
app.use('/api/iot', iotRoutes);
app.use('/api/healthcare', healthcareRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const { getMQTTClient } = require('./config/mqtt');
  const mqttClient = getMQTTClient();
  
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    mqtt: mqttClient && mqttClient.connected ? 'connected' : 'disconnected'
  });
});

// Public counts for login page - NOW ACCURATE
app.get('/api/stats/public', async (req, res) => {
  try {
    const User = require('./models/Users');
    const { pool } = require('./config/postgres');
    
    // Count real users in MongoDB
    const userCount = await User.countDocuments();
    
    // Count real cycles in PostgreSQL
    const cycleResult = await pool.query('SELECT COUNT(*) FROM menstrual_cycle');
    const cycleCount = parseInt(cycleResult.rows[0].count) || 0;

    // "Active Now" is people who logged in in the last 30 mins
    const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);
    const activeNow = await User.countDocuments({ lastLogin: { $gte: thirtyMinsAgo } });

    res.json({
      users: userCount,
      cycles: cycleCount,
      sensors: 9, 
      activeNow: Math.max(1, activeNow) // Always show at least 1 (the current user)
    });
  } catch (error) {
    console.error('Stats Error:', error);
    res.json({ users: 0, cycles: 0, sensors: 9, activeNow: 1 });
  }
});

// Analytics endpoint
app.get('/api/analytics/dashboard', async (req, res) => {
  try {
    const { VendingMachine, Washroom, Incinerator, Alert } = require('./models');
    
    const [
      totalMachines,
      totalWashrooms,
      totalIncinerators,
      activeAlerts,
      lowStockMachines,
      washroomsNeedingCleaning
    ] = await Promise.all([
      VendingMachine.countDocuments({ isActive: true }),
      Washroom.countDocuments({ isActive: true }),
      Incinerator.countDocuments({ isActive: true }),
      Alert.countDocuments({ resolved: false }),
      VendingMachine.countDocuments({ status: 'low-stock' }),
      Washroom.countDocuments({ status: 'needs-cleaning' })
    ]);

    res.json({
      totalMachines,
      totalWashrooms,
      totalIncinerators,
      activeAlerts,
      lowStockMachines,
      washroomsNeedingCleaning,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('\nShutting down gracefully...');
  
  const { disconnectMQTT } = require('./config/mqtt');
  const { disconnectDatabase } = require('./config/database');
  
  disconnectMQTT();
  await disconnectDatabase();
  
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();
    
    // Connect to PostgreSQL
    await connectPostgres();
    
    // Connect to MQTT broker
    connectMQTT();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log('=================================');
      console.log('✓ MenstruCare Backend Server');
      console.log(`  Port: ${PORT}`);
      console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`  Health check: http://localhost:${PORT}/api/health`);
      console.log('=================================');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;