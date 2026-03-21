const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  symptoms: {
    type: [String],
    required: true,
  },
  severity: {
    type: String,
    required: true,
  },
  healthScore: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  aiAdvice: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('History', historySchema);
