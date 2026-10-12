import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, getDBStatus } from './config/db.js';
import compareRoutes from './routes/compare.js';
import { errorHandler } from './middleware/uploadMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Core Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check route
app.get("/", (req, res) => {
  res.json({
    status: 'ok',
    service: 'AI Resume & JD Parser API',
    mongoConnected: getDBStatus(),
    timestamp: new Date().toISOString(),
  });
});

// Modular Routes
app.use('/api', compareRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Connect to MongoDB and start server if run directly
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

