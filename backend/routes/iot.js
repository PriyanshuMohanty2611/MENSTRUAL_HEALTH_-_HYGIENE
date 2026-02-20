const express = require('express');
const router = express.Router();
const IoTData = require('../models/IoTData');

// Get latest IoT data
router.get('/latest', async (req, res) => {
  try {
    const washroomData = await IoTData.findOne({ type: 'WASHROOM' }).sort({ createdAt: -1 });
    const disposalData = await IoTData.findOne({ type: 'DISPOSAL' }).sort({ createdAt: -1 });
    res.json({ washroom: washroomData, disposal: disposalData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Post IoT data (called by ESP32 or simulated)
router.post('/data', async (req, res) => {
  try {
    const { deviceId, type, metrics } = req.body;
    
    // Auto-calculate isFull for bins
    if (type === 'DISPOSAL' && metrics.binWeight > 90) {
      metrics.isFull = true;
      console.log(`[ALERT] Bin ${deviceId} is full! Requesting incineration.`);
    }

    const newData = new IoTData({ deviceId, type, metrics });
    await newData.save();
    
    res.status(201).json(newData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
