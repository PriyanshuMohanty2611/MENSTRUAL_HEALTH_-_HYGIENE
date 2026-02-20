const mongoose = require('mongoose');

const washroomSchema = new mongoose.Schema({
  washroomId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  location: {
    type: String,
    required: true
  },
  airQuality: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  humidity: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  temperature: {
    type: Number,
    default: 0
  },
  gasLevels: {
    co2: {
      type: Number,
      default: 0
    },
    ammonia: {
      type: Number,
      default: 0
    },
    methane: {
      type: Number,
      default: 0
    }
  },
  occupancyStatus: {
    type: Boolean,
    default: false
  },
  cleaningSchedule: [{
    scheduledTime: Date,
    completedTime: Date,
    cleanedBy: String,
    duration: Number,
    notes: String
  }],
  lastCleaned: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['excellent', 'good', 'needs-cleaning', 'maintenance', 'offline'],
    default: 'good'
  },
  alerts: [{
    type: {
      type: String,
      enum: ['hygiene', 'maintenance', 'emergency']
    },
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    resolved: {
      type: Boolean,
      default: false
    },
    resolvedAt: Date,
    resolvedBy: String
  }],
  facilityInfo: {
    totalStalls: Number,
    availableStalls: Number,
    hasDisabledAccess: Boolean,
    hasBabyChanging: Boolean
  },
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
washroomSchema.index({ washroomId: 1 });
washroomSchema.index({ location: 1 });
washroomSchema.index({ status: 1 });

// Virtual for cleanliness score
washroomSchema.virtual('cleanlinessScore').get(function() {
  const airScore = this.airQuality;
  const humidityScore = 100 - Math.abs(this.humidity - 50);
  const timeScore = Math.max(0, 100 - ((Date.now() - this.lastCleaned) / (1000 * 60 * 60)));
  return Math.round((airScore + humidityScore + timeScore) / 3);
});

const Washroom = mongoose.model('Washroom', washroomSchema);

module.exports = Washroom;