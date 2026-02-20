const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Santary Pads', 'Tablets', 'Health Kit'],
    required: true
  },
  material: {
    type: String, // e.g., 'Banana Fiber', 'Bamboo Fiber'
    required: function() { return this.category === 'Santary Pads'; }
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 20
  },
  biodegradabilityScore: {
    type: Number, // Percentage or score
    min: 0,
    max: 100
  },
  imageUrl: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
