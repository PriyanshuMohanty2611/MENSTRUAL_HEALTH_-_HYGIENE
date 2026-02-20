const mongoose = require('mongoose');

const vendingMachineSchema = new mongoose.Schema({
  machineId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  location: {
    type: String,
    required: true
  },
  stockLevel: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  maxCapacity: {
    type: Number,
    default: 100
  },
  lastRefill: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['operational', 'low-stock', 'maintenance', 'offline'],
    default: 'operational'
  },
  transactions: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    quantity: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'UPI', 'card', 'free']
    },
    amount: Number,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  sensorData: {
    temperature: Number,
    humidity: Number,
    lastUpdate: Date
  },
  maintenanceHistory: [{
    date: Date,
    type: {
      type: String,
      enum: ['routine', 'repair', 'refill', 'emergency']
    },
    performedBy: String,
    notes: String,
    cost: Number
  }],
  qrCode: String,
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
vendingMachineSchema.index({ machineId: 1 });
vendingMachineSchema.index({ location: 1 });
vendingMachineSchema.index({ status: 1 });

// Virtual for stock percentage
vendingMachineSchema.virtual('stockPercentage').get(function() {
  return (this.stockLevel / this.maxCapacity) * 100;
});

const VendingMachine = mongoose.model('VendingMachine', vendingMachineSchema);

module.exports = VendingMachine;