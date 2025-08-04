import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Signup
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists)
    return res.status(400).json({ error: 'User already exists' });

  const user = await User.create({ name, email, password });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
};

// Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
};

// ✅ Dashboard (Protected)
export const getDashboard = (req, res) => {
  res.json({
    message: `Welcome, ${req.user.name}`,
    wallet: req.user.wallet,
    coins: req.user.coins,
  });
};

// ✅ Add Money to Wallet (Protected)
export const addMoney = async (req, res) => {
  const { amount } = req.body;

  req.user.wallet += amount;
  await req.user.save();

  res.json({ wallet: req.user.wallet });
};

// ✅ Get Ride History (Protected, placeholder)
export const getRideHistory = async (req, res) => {
  res.json({
    rideHistory: req.user.rideHistory || [],
  });
};
