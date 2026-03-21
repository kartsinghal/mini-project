const symptomData = require('../data/symptoms.json');

/**
 * Match user input against symptom dataset using fuzzy keyword matching
 */
function matchSymptoms(inputSymptoms) {
  const normalizedInput = inputSymptoms
    .map((s) => s.toLowerCase().trim())
    .filter(Boolean);

  const results = [];

  for (const symptom of symptomData) {
    let matchScore = 0;
    const matchedKeywords = [];

    for (const inputTerm of normalizedInput) {
      // Direct name match
      if (symptom.symptom_name.includes(inputTerm) || inputTerm.includes(symptom.symptom_name)) {
        matchScore += 10;
        matchedKeywords.push(inputTerm);
        continue;
      }

      // Alias match
      const aliasMatch = symptom.aliases.some(
        (alias) => alias.includes(inputTerm) || inputTerm.includes(alias)
      );
      if (aliasMatch) {
        matchScore += 8;
        matchedKeywords.push(inputTerm);
        continue;
      }

      // Partial match against name
      const nameWords = symptom.symptom_name.split(' ');
      const partialName = nameWords.some((word) => inputTerm.includes(word) || word.includes(inputTerm));
      if (partialName && inputTerm.length > 3) {
        matchScore += 4;
        matchedKeywords.push(inputTerm);
        continue;
      }

      // Partial match against aliases
      const partialAlias = symptom.aliases.some((alias) => {
        const aliasWords = alias.split(' ');
        return aliasWords.some((word) => inputTerm.includes(word) || word.includes(inputTerm));
      });
      if (partialAlias && inputTerm.length > 3) {
        matchScore += 3;
        matchedKeywords.push(inputTerm);
      }
    }

    if (matchScore > 0) {
      results.push({
        ...symptom,
        matchScore,
        matchedKeywords: [...new Set(matchedKeywords)],
      });
    }
  }

  // Sort by score (descending) and return top 5
  return results.sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);
}

// POST /api/symptoms/analyze
const analyzeSymptoms = (req, res) => {
  try {
    const { symptoms, symptom_text } = req.body;

    let inputSymptoms = [];

    if (symptoms && Array.isArray(symptoms) && symptoms.length > 0) {
      inputSymptoms = symptoms;
    } else if (symptom_text && typeof symptom_text === 'string') {
      // Parse comma-separated or natural language input
      inputSymptoms = symptom_text
        .split(/[,;\n]+/)
        .map((s) => s.trim())
        .filter(Boolean);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide symptoms as an array or symptom_text string.',
      });
    }

    if (inputSymptoms.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid symptoms provided.',
      });
    }

    const matchedResults = matchSymptoms(inputSymptoms);

    if (matchedResults.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No matching symptoms found in our database.',
        data: {
          input: inputSymptoms,
          matches: [],
          advisory: {
            title: 'No Match Found',
            body: 'We could not find relevant advisory for the symptoms you entered. Please try using common symptom names like "fever", "headache", "cough", etc. For persistent or severe symptoms, please consult a healthcare professional.',
          },
        },
      });
    }

    // Check if any critical symptom matched
    const hasCritical = matchedResults.some((r) => r.severity === 'critical');

    // Calculate Health Score
    let healthScore = 100;
    let highestSeverity = 'mild';

    matchedResults.forEach((match) => {
      if (match.severity === 'mild') healthScore -= 10;
      if (match.severity === 'moderate') {
        healthScore -= 20;
        if (highestSeverity === 'mild') highestSeverity = 'moderate';
      }
      if (match.severity === 'severe') {
        healthScore -= 30;
        if (highestSeverity !== 'critical') highestSeverity = 'severe';
      }
      if (match.severity === 'critical') {
        healthScore -= 40;
        highestSeverity = 'critical';
      }
    });
    healthScore = Math.max(0, healthScore);

    let category = 'Safe';
    if (healthScore < 50) category = 'Risk';
    else if (healthScore < 80) category = 'Attention needed';

    return res.status(200).json({
      success: true,
      healthScore,
      category,
      overallSeverity: highestSeverity,
      data: {
        input: inputSymptoms,
        matches: matchedResults.map((m) => ({
          id: m.id,
          symptom_name: m.symptom_name,
          severity: m.severity,
          possible_conditions: m.possible_conditions,
          precautions: m.precautions,
          basic_advice: m.basic_advice,
          when_to_see_doctor: m.when_to_see_doctor,
          matchScore: m.matchScore,
          matchedKeywords: m.matchedKeywords,
        })),
        emergency_alert: hasCritical,
        disclaimer:
          'This advisory is for awareness purposes only and does NOT constitute medical diagnosis or treatment. Always consult a qualified healthcare professional for medical advice.',
      },
    });
  } catch (error) {
    console.error('Analyze symptoms error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again.',
    });
  }
};

// GET /api/symptoms/list
const listSymptoms = (req, res) => {
  try {
    const symptoms = symptomData.map((s) => ({
      id: s.id,
      symptom_name: s.symptom_name,
      severity: s.severity,
      aliases: s.aliases,
    }));
    return res.status(200).json({ success: true, data: symptoms });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports = { analyzeSymptoms, listSymptoms };
