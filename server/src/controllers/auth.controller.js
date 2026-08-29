import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import User from '../models/User.js';

const signToken = (id) => jwt.sign({ id }, config.jwtSecret, { expiresIn: '7d' });

const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });

    const user = await User.create({ name, email, password, role: role || 'analyst' });
    const token = signToken(user._id);
    setTokenCookie(res, token);
    res.status(201).json({ success: true, token, user: user.toSafeObject() });
  } catch (err) { next(err); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = signToken(user._id);
    setTokenCookie(res, token);
    res.json({ success: true, token, user: user.toSafeObject() });
  } catch (err) { next(err); }
};

export const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out' });
};

export const getMe = async (req, res) => {
  res.json({ success: true, user: req.user.toSafeObject() });
};
