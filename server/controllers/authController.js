const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'healthlens_default_secret';
const JWT_EXPIRES_IN = '7d';

// ── Helper ──────────────────────────────────────────────────────────────────
const signToken = (userId) =>
  jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

// ── POST /api/auth/signup ────────────────────────────────────────────────────
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic field validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    // Check for duplicate email
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({ name: name.trim(), email: email.toLowerCase().trim(), password: hashed });

    // Issue token
    const token = signToken(user._id);

    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error('[signup]', err);
    // Mongoose duplicate key error
    if (err.code === 11000) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// ── POST /api/auth/login ─────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Find user (include password for comparison)
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = signToken(user._id);

    res.status(200).json({
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error('[login]', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// ── GET /api/auth/profile ───────────────────────────────────────────────────
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      phone: user.phone,
    });
  } catch (err) {
    console.error('[getProfile]', err);
    res.status(500).json({ message: 'Server error fetching profile.' });
  }
};

// ── PUT /api/auth/profile ───────────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const { name, age, gender, phone } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (name && name.trim().length >= 2) user.name = name.trim();
    if (age !== undefined) user.age = Number(age) || undefined;
    if (gender) user.gender = gender;
    if (phone !== undefined) user.phone = phone.trim();

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error('[updateProfile]', err);
    res.status(400).json({ message: err.message || 'Error updating profile.' });
  }
};
