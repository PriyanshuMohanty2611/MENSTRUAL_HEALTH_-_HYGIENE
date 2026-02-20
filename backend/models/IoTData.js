const mongoose = require('mongoose');

const iotDataSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['WASHROOM', 'DISPOSAL'],
    required: true
  },
  location: String,
  metrics: {
    temperature: Number,
    humidity: Number,
    waterSpill: Boolean,
    binWeight: Number,
    isFull: {
      type: Boolean,
      default: false
    }
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('IoTData', iotDataSchema);
