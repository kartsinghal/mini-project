const express = require('express');
const { signup, login, getProfile, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', signup);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/profile
router.get('/profile', protect, getProfile);

// PUT /api/auth/profile
router.put('/profile', protect, updateProfile);

module.exports = router;
