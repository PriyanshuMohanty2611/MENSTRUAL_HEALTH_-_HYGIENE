const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  role: {
    type: String,
    enum: ['ADMIN', 'PRODUCER', 'CUSTOMER'],
    default: 'CUSTOMER'
  },
  lunaCoins: {
    type: Number,
    default: 0
  },
  cycleData: [{
    startDate: {
      type: Date,
      required: true
    },
    endDate: Date,
    flowIntensity: {
      type: String,
      enum: ['light', 'moderate', 'heavy']
    },
    symptoms: [{
      type: String
    }],
    notes: String
  }],
  preferences: {
    language: {
      type: String,
      default: 'en'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);

// PostgreSQL Synchronization Hook
userSchema.post('save', async function(doc) {
  if (doc.cycleData && doc.cycleData.length > 0) {
    try {
      const { pool } = require('../config/postgres');
      // Sync logic: Keep PostgreSQL in sync with the MongoDB cycleData array
      await pool.query('DELETE FROM menstrual_cycle WHERE user_id = $1', [doc._id.toString()]);
      
      for (const entry of doc.cycleData) {
        await pool.query(
          'INSERT INTO menstrual_cycle (user_id, start_date, end_date, flow_intensity, symptoms, notes) VALUES ($1, $2, $3, $4, $5, $6)',
          [
            doc._id.toString(),
            entry.startDate,
            entry.endDate || null,
            entry.flowIntensity || null,
            entry.symptoms || [],
            entry.notes || null
          ]
        );
      }
      console.log(`✓ PostgreSQL Sync: ${doc.cycleData.length} entries for user ${doc._id}`);
    } catch (err) {
      console.error('✗ PostgreSQL Sync Error:', err.message);
    }
  }
});

module.exports = User;