import express from "express";
import axios from "axios";

const router = express.Router();

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const apiKey = process.env.AI_API_KEY;

// Predefined crisis message response
const crisisResponseText =
  "It seems like you're going through a really difficult time. Please consider reaching out to the following crisis hotline for immediate support:";

router.post("/", async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required and must be a string." });
    }

    if (req.crisis) {
      // Crisis detected - override AI response
      return res.json({
        reply: crisisResponseText,
        crisis: true,
        hotline: req.hotline
      });
    }

    if (!apiKey) {
      return res.status(500).json({ error: "AI_API_KEY environment variable is not set." });
    }

    // Call OpenAI API (chat completion with GPT-4 style prompt)
    const systemPrompt = `
You are MindMate, a compassionate and empathetic mental health support chatbot. 
Respond gently and supportively, providing emotional support but do not give medical advice.
If a crisis is detected, always refer to emergency contacts (handled separately).
    `.trim();

    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        max_tokens: 500,
        temperature: 0.7
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        }
      }
    );

    const aiReply =
      response.data?.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I couldn't generate a response at this time.";

    res.json({ reply: aiReply, crisis: false, hotline: null });
  } catch (error) {
    console.error("Error in POST /chat:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to process your message. Please try again later."
    });
  }
});

export default router;
