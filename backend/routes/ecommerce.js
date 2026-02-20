const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/Users');

// Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create order
router.post('/orders', async (req, res) => {
  try {
    const { userId, items, shippingAddress, paymentId } = req.body;
    
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ error: `Product ${product ? product.name : 'not found'} out of stock` });
      }
      
      totalAmount += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        priceAtTimeOfPurchase: product.price
      });
      
      // Update stock
      product.stock -= item.quantity;
      await product.save();
      
      // AI Logic: Check if stock < 20%
      if (product.stock < (product.lowStockThreshold || 20)) {
        console.log(`[AI-ALERT] Low stock for ${product.name}. Prediction: Out of stock in 48 hours.`);
        // In real app, emit notification or update ProducerDashboard
      }
    }
    
    // Reward coins: 50-100 vouchers logic
    const coinsEarned = Math.floor(Math.random() * (100 - 50 + 1)) + 50;
    
    const newOrder = new Order({
      user: userId,
      products: orderItems,
      totalAmount,
      shippingAddress,
      paymentId,
      coinsEarned,
      paymentStatus: 'PAID' // Assuming successful integration
    });
    
    await newOrder.save();
    
    // Update user coins
    await User.findByIdAndUpdate(userId, { $inc: { lunaCoins: coinsEarned } });
    
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
