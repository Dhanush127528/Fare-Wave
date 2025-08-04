import express from "express";
import { addMoney, getWalletBalance } from "../controllers/walletController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, addMoney);
router.get("/balance", protect, getWalletBalance);

export default router;
