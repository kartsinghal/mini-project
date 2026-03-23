require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const symptomsRoutes = require('./routes/symptomsRoutes');
const authRoutes = require('./routes/authRoutes');
const historyRoutes = require('./routes/historyRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger (dev)
if (process.env.NODE_ENV === 'development') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    message: '🩺 HealthLens API is running!',
    version: '1.0.0',
    endpoints: {
      signup: 'POST /api/auth/signup',
      login: 'POST /api/auth/login',
      analyzeSymptoms: 'POST /api/symptoms/analyze',
      listSymptoms: 'GET /api/symptoms/list',
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/symptoms', symptomsRoutes);
app.use('/api/history', historyRoutes);

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── MongoDB Connection (optional – works without if no MONGO_URI set) ─────────
const startServer = async () => {
  if (process.env.MONGO_URI) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('✅ MongoDB connected');
    } catch (err) {
      console.warn('⚠️  MongoDB connection failed – running with JSON dataset only.');
    }
  } else {
    console.log('ℹ️  No MONGO_URI set – running with JSON dataset only (recommended for demo).');
  }

  app.listen(PORT, () => {
    console.log(`\n🚀 HealthLens API server running at http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📋 Endpoints:`);
    console.log(`   POST http://localhost:${PORT}/api/symptoms/analyze`);
    console.log(`   GET  http://localhost:${PORT}/api/symptoms/list\n`);
  });
};

startServer();
