// Backend/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import eventRoutes from './routes/eventRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import './config/database.js'; // Initialize DB connection

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/events', eventRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Centralized error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📅 Events API: http://localhost:${PORT}/api/events`);
});
