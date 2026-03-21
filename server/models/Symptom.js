const mongoose = require('mongoose');

const symptomSchema = new mongoose.Schema(
  {
    symptom_name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    aliases: [{ type: String, lowercase: true }],
    possible_conditions: [{ type: String }],
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'critical'],
      default: 'mild',
    },
    precautions: [{ type: String }],
    basic_advice: { type: String },
    when_to_see_doctor: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Symptom', symptomSchema);
