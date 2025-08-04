import User from "../models/User.js";

// 🔄 Add Money to Wallet
export const addMoney = async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.user._id);

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    user.wallet += amount;
    await user.save();

    res.status(200).json({ message: "Money added", wallet: user.wallet });
  } catch (err) {
    res.status(500).json({ error: "Failed to add money" });
  }
};

// 📥 Get Wallet Balance
export const getWalletBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ wallet: user.wallet });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch wallet balance" });
  }
};
