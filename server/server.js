/**
 * NER Smart Logistics & Accessibility Intelligence Platform
 * Main Server Entry Point
 * 
 * AI-powered logistics platform for India's North Eastern Region
 * Built for Smart India Hackathon (SIH)
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const { initializeDatabase } = require('./src/models/database');
const errorHandler = require('./src/middleware/errorHandler');
const setupSocketHandlers = require('./src/socket/handlers');
const { startSimulation } = require('./src/services/simulationService');

// Import route modules
const authRoutes = require('./src/routes/auth');
const vehicleRoutes = require('./src/routes/vehicles');
const routeRoutes = require('./src/routes/routes');
const alertRoutes = require('./src/routes/alerts');
const reportRoutes = require('./src/routes/reports');
const weatherRoutes = require('./src/routes/weather');
const analyticsRoutes = require('./src/routes/analytics');
const districtRoutes = require('./src/routes/districts');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// ============================================================
// MIDDLEWARE
// ============================================================

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));

// Parse JSON bodies (with 50MB limit for photo uploads)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// ============================================================
// API ROUTES
// ============================================================

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/districts', districtRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'running',
      platform: 'NER Smart Logistics Intelligence Platform',
      version: '1.0.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Error handler (must be last middleware)
app.use(errorHandler);

// ============================================================
// SOCKET.IO SETUP
// ============================================================

setupSocketHandlers(io);

// ============================================================
// SERVER START
// ============================================================

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Initialize the database and seed data
    console.log('🔧 Initializing database...');
    initializeDatabase();
    console.log('✅ Database initialized with NER district, route, and vehicle data');

    // Start the server
    server.listen(PORT, () => {
      console.log('');
      console.log('═══════════════════════════════════════════════════════════════');
      console.log('  🚛  NER Smart Logistics & Accessibility Intelligence Platform');
      console.log('  📡  AI-Powered Logistics for North Eastern Region');
      console.log('═══════════════════════════════════════════════════════════════');
      console.log(`  🌐  Server running on:  http://localhost:${PORT}`);
      console.log(`  📊  API Base URL:       http://localhost:${PORT}/api`);
      console.log(`  🔌  WebSocket:          ws://localhost:${PORT}`);
      console.log(`  🏥  Health Check:       http://localhost:${PORT}/api/health`);
      console.log('═══════════════════════════════════════════════════════════════');
      console.log('');
      console.log('  Default Credentials:');
      console.log('    Admin:    admin / admin123');
      console.log('    Officer:  officer / officer123');
      console.log('    Viewer:   viewer / viewer123');
      console.log('');
    });

    // Start real-time simulation after a short delay
    setTimeout(() => {
      console.log('🚀 Starting real-time simulation engine...');
      startSimulation(io);
      console.log('✅ Simulation engine active — vehicles moving, alerts generating');
    }, 2000);

  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received. Shutting down...');
  server.close(() => {
    process.exit(0);
  });
});
