import express from "express";
import { checkIn, checkOut } from "../controllers/qrController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/check-in", protect, checkIn);
router.post("/check-out", protect, checkOut);

export default router;
