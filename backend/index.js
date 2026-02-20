const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Firebase Admin setup
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL
});

const db = admin.database();

// Test route
app.get('/test', (req, res) => {
  res.send('Backend is working');
});

// Route to add data
app.post('/addData', async (req, res) => {
  try {
    const ref = db.ref('IITdata');
    await ref.push(req.body);
    res.status(200).send('Data added to Firebase');
  } catch (err) {
    res.status(500).send(err);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
