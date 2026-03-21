const mongoose = require('mongoose');

const advisorySchema = new mongoose.Schema(
  {
    symptom_ref: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Symptom',
    },
    symptom_name: { type: String, required: true },
    advisory_title: { type: String },
    advisory_body: { type: String },
    emergency_level: {
      type: String,
      enum: ['low', 'medium', 'high', 'emergency'],
      default: 'low',
    },
    resources: [
      {
        title: String,
        url: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Advisory', advisorySchema);
