const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes Import
app.use('/api/certificates', require('./routes/certificateRoutes'));
app.use('/api/contacts', require('./routes/contactRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/placements', require('./routes/placementRoutes'));
app.use('/api/trainings', require('./routes/trainingRoutes'));

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ message: "Mentore Solutions API is live!" });
});

// लोकलवर रन होण्यासाठी (Vercel हे आपोआप दुर्लक्षित करेल)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Local server on port ${PORT}`));
}

// Vercel साठी export करणे अनिवार्य आहे
module.exports = app;