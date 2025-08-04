import express from "express";
import { getRideHistory, addRide } from "../controllers/rideController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/history", protect, getRideHistory);
router.post("/", protect, addRide); // Use POST /api/ride for adding a ride

export default router;