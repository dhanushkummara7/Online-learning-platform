const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const Course = require('./models/Course');
const seedData = require('./seeders/seed');

const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const app = express();

// ─── CORS ───────────────────────────────────────────────────────────────────
app.use(cors({ origin: true, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// ─── DB Init (lazy, once) ───────────────────────────────────────────────────
let dbReady;
const ensureDB = async () => {
  if (!dbReady) {
    dbReady = (async () => {
      await connectDB();
      const count = await Course.countDocuments();
      if (count === 0) {
        console.log('Database empty — auto-seeding...');
        await seedData();
      }
    })().catch((err) => {
      dbReady = null;
      throw err;
    });
  }
  return dbReady;
};

// Middleware: init DB before every request
app.use(async (req, res, next) => {
  try {
    await ensureDB();
    next();
  } catch (err) {
    console.error('DB init failed:', err.message);
    res.status(503).json({ success: false, message: 'Database unavailable' });
  }
});

// ─── Static uploads (local dev only — Vercel is stateless) ──────────────────
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

// ─── API Routes ─────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/enrollments', require('./routes/enrollmentRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/instructor', require('./routes/instructorRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'SkillForge MERN LMS',
    timestamp: new Date().toISOString(),
  });
});

// Root fallback (API-only — client service serves the SPA)
app.get('/', (req, res) => {
  res.json({ status: 'online', message: 'SkillForge API' });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// ─── Local Dev: start HTTP server ───────────────────────────────────────────
if (require.main === module) {
  const port = Number(process.env.PORT || 5000);

  const listen = (p) => {
    const server = app.listen(p, () => {
      console.log(`====================================================`);
      console.log(` SkillForge API running on port ${p}`);
      console.log(` http://localhost:${p}/api/health`);
      console.log(`====================================================`);
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE' && p < 5100) {
        console.warn(`Port ${p} busy — trying ${p + 1}...`);
        listen(p + 1);
      } else {
        console.error('Server error:', err.message);
        process.exit(1);
      }
    });
  };

  listen(port);
}

// ─── Export for Vercel ──────────────────────────────────────────────────────
module.exports = app;
