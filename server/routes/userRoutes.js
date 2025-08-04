import express from "express";
import {
  registerUser,
  loginUser,
  getDashboard,
  addMoney,
  getRideHistory,
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// 🛡️ Protected routes
router.get("/dashboard", protect, getDashboard);
router.post("/wallet", protect, addMoney);
router.get("/history", protect, getRideHistory);

export default router;
