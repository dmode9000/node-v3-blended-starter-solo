// src/server.js
import express from 'express';
import cors from 'cors';
// Import middleware
import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { connectMongoDB } from './db/connectMongoDB.js'; // Connect to MongoDB
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { logger } from './middleware/logger.js';
import productsRoutes from './routes/productsRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT ?? 3030;

// Global Middleware
app.use(logger); // Logger first — sees all requests
app.use(express.json()); // JSON body parsing
app.use(cookieParser()); // Cookie parsing
app.use(cors()); // Allow requests from other domains

// Routes
app.use(authRoutes);
app.use(productsRoutes);
app.use(userRoutes);

// Route for testing error middleware
app.get('/test-error', () => {
  // Simulating an error
  throw new Error('Simulated server error');
});

// 404 Middleware (after all routes)
app.use(notFoundHandler);

// celebrate error handling (validation)
app.use(errors());

// Error handling middleware (last)
app.use(errorHandler);

await connectMongoDB(); // Connect to MongoDB before starting the server

// Server startup
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
