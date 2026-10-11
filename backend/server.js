require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// FIX: Explicitly allow requests from your Vite frontend development server
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Connect to Local MongoDB Community Server
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hospitaldb')
  .then(() => console.log('MongoDB Hospital DB Connected...'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Patient Schema and Model
const PatientSchema = new mongoose.Schema({
  name: String,
  age: Number,
  disease: String,
  admittedAt: { type: Date, default: Date.now }
});
const Patient = mongoose.model('Patient', PatientSchema);

// API Routes
app.get('/api/patients', async (req, res) => {
  try {
    const patients = await Patient.find().sort({ admittedAt: -1 });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/patients', async (req, res) => {
  try {
    const { name, age, disease } = req.body;
    const newPatient = new Patient({ name, age: Number(age), disease });
    await newPatient.save();
    res.status(201).json(newPatient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Hospital backend running on port ${PORT}`));
