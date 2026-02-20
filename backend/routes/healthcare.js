const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// Book appointment
router.post('/book', async (req, res) => {
  try {
    const { patientId, doctor, appointmentDate, timeSlot } = req.body;
    const newAppointment = new Appointment({
      patient: patientId,
      doctor,
      appointmentDate,
      timeSlot
    });
    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user appointments
router.get('/user/:userId', async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.params.userId }).sort({ appointmentDate: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
