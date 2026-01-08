const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { pool, initializeDatabase } = require('./config/database');
const userRoutes = require('./routes/users');
const documentationRoutes = require('./routes/documentation');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api', userRoutes);
app.use('/api', documentationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// Initialize database and start server
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Backend server running on http://localhost:${PORT}`);
      console.log(`📚 API Documentation available at http://localhost:${PORT}/api`);
      console.log(`💾 Database: ${process.env.DB_NAME}`);
    });
  })
  .catch(error => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });

module.exports = app;
