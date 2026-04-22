const express = require('express');
const router = express.Router();
const aiAssistant = require('../services/aiAssistant');
const { authenticate } = require('../middleware/auth');

// Generate itinerary
router.post('/itinerary', authenticate, async (req, res) => {
  try {
    const itinerary = await aiAssistant.generateItinerary(req.body);
    res.json({ success: true, itinerary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Answer question
router.post('/ask', async (req, res) => {
  try {
    const answer = await aiAssistant.answerQuestion(req.body.question);
    res.json({ success: true, answer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Recommend activities
router.post('/recommend', authenticate, async (req, res) => {
  try {
    const recommendations = await aiAssistant.recommendActivities(req.body);
    res.json({ success: true, recommendations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
