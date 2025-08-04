import express from "express";
import { createTicket, getTickets } from "../controllers/ticketController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createTicket);
router.get("/", authMiddleware, getTickets);

export default router;
