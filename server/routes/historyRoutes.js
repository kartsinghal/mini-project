const express = require('express');
const router = express.Router();
const { getHistory, addHistory } = require('../controllers/historyController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getHistory)
  .post(protect, addHistory);

module.exports = router;
