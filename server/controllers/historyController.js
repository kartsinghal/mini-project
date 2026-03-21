const History = require('../models/History');

// GET /api/history
const getHistory = async (req, res) => {
  try {
    const history = await History.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: history.length, data: history });
  } catch (error) {
    console.error('getHistory error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching history' });
  }
};

// POST /api/history
const addHistory = async (req, res) => {
  try {
    const { symptoms, severity, healthScore, category, aiAdvice } = req.body;
    
    // Basic validation
    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({ success: false, message: 'Symptoms required' });
    }

    const history = await History.create({
      user: req.user._id,
      symptoms,
      severity,
      healthScore,
      category,
      aiAdvice,
    });
    res.status(201).json({ success: true, data: history });
  } catch (error) {
    console.error('addHistory error:', error);
    res.status(500).json({ success: false, message: 'Server error saving history' });
  }
};

module.exports = { getHistory, addHistory };
