const express = require('express');
const router = express.Router();
// We'll use a mocked AI response for now since we don't have an API key, 
// but the structure is ready for OpenAI/Gemini integration.

const MEDICAL_SYSTEM_PROMPT = `
You are 'Luna', an empathetic, professional, and highly knowledgeable AI gynecologist and menstrual health expert.
Your SOLE purpose is to answer questions related to menstrual health, feminine hygiene, puberty, reproductive health, and our biodegradable pad products.

CRITICAL RULES:
1. If the user asks a question UNRELATED to menstrual health, gynecology, or our products (e.g., coding, weather, history, general chat), you MUST refuse to answer. Respond exactly with: "I am a specialized health assistant. I can only answer questions related to menstrual health and hygiene. How can I help you with your health today?"
2. Do not provide official medical diagnoses. Always encourage the user to use the 'Book Appointment' feature to see a real doctor for severe pain or serious symptoms.
3. Be warm, culturally sensitive, and easy to understand for users in rural areas.
`;

router.post('/ask-luna', async (req, res) => {
  try {
    const { userMessage } = req.body;

    // TODO: Integrate with real LLM (OpenAI/Gemini)
    // For now, providing intelligent mocked responses for common questions
    
    let mockResponse = "";
    const msg = userMessage.toLowerCase();

    if (msg.includes("cramp") || msg.includes("pain")) {
      mockResponse = "I'm sorry to hear you're in pain. For period cramps (dysmenorrhea), try using a heating pad on your lower back or abdomen. Gentle stretching or yoga can also help. If the pain is severe or prevents you from daily activities, please book an appointment with our doctors through the Healthcare portal.";
    } else if (msg.includes("cycle") || msg.includes("regular")) {
      mockResponse = "A normal menstrual cycle is typically between 21 and 35 days. It's very common for cycles to vary slightly each month, especially if you're stressed or have changed your diet. You can track your trends in the LunaCare Cycle Tracker to see your personal patterns!";
    } else if (msg.includes("pad") || msg.includes("product")) {
      mockResponse = "Our LunaCare pads are made from 100% biodegradable materials like banana and bamboo fiber. They are hypoallergenic and free from harsh chemicals. You can find them in our Shop section!";
    } else if (msg.includes("hello") || msg.includes("hi")) {
        mockResponse = "Hello! I am Luna, your menstrual health assistant. How can I help you with your health today?";
    } else {
      mockResponse = "I am a specialized health assistant. I can only answer questions related to menstrual health and hygiene. How can I help you with your health today?";
    }

    res.json({ reply: mockResponse });

  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({ error: "Luna is currently taking a break. Please try again later." });
  }
});

module.exports = router;
