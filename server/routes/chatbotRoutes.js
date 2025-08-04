// routes/chatbotRoutes.js
import express from 'express';
import { handleUserMessage } from '../controllers/chatbotController.js';

const router = express.Router();

// ✅ Define route relative to the base mount path
router.post('/message', handleUserMessage);

export default router;

