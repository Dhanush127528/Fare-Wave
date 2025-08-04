// routes/chatbotRoutes.js

import express from 'express';
import { handleUserMessage } from '../controllers/chatbotController.js';

const router = express.Router();

router.post('/message', handleUserMessage);

export default router;

