// import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import compareRoutes from './routes/compare.js';
import { errorHandler } from './middleware/uploadMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check (also reports the real Mongo error)
app.get('/', async (req, res) => {
  let error = null;
  try {
    await connectDB();
  } catch (e) {
    error = e.message;
  }
  res.json({
    status: 'ok',
    service: 'AI Resume & JD Parser API',
    mongoConnected: mongoose.connection.readyState === 1,
    mongoError: error,
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', compareRoutes);
app.use(errorHandler);

async function startServer() {
  await connectDB();
  if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
      console.log(`🚀 Express Backend running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;