// server.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';


import chatbotRoutes from './routes/chatbotRoutes.js';
import userRoutes from './routes/userRoutes.js';
import locationRoutes from "./routes/locationRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import rideRoutes from "./routes/rideRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import qrRoutes from "./routes/qrRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/user', userRoutes); // ✅ Fixed here
app.use("/api/locations", locationRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/qr", qrRoutes);




// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
