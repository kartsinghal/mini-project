const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { analyzeSymptoms, listSymptoms } = require('../controllers/symptomsController');

// Validation middleware
const validateSymptomInput = [
  body('symptoms')
    .optional()
    .isArray()
    .withMessage('symptoms must be an array'),
  body('symptoms.*')
    .optional()
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('Each symptom must be a non-empty string'),
  body('symptom_text')
    .optional()
    .isString()
    .isLength({ min: 1, max: 500 })
    .withMessage('symptom_text must be a string of max 500 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
];

// Routes
router.post('/analyze', validateSymptomInput, analyzeSymptoms);
router.get('/list', listSymptoms);

module.exports = router;
