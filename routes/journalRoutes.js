import express from "express";
import JournalEntry from "../models/JournalEntry.js";

const router = express.Router();

// POST /journal/add - add new mood journal entry
router.post("/add", async (req, res) => {
  try {
    const { userId, moodRating, journalText } = req.body;

    if (
      !userId ||
      typeof userId !== "string" ||
      !moodRating ||
      typeof moodRating !== "number" ||
      !Number.isInteger(moodRating) ||
      moodRating < 1 ||
      moodRating > 10 ||
      !journalText ||
      typeof journalText !== "string"
    ) {
      return res.status(400).json({
        error: "Invalid input. Required fields: userId (string), moodRating (integer 1-10), journalText (string)."
      });
    }

    const newEntry = new JournalEntry({
      userId: userId.trim(),
      moodRating,
      journalText: journalText.trim()
    });

    await newEntry.save();

    res.json({ success: true, entry: newEntry });
  } catch (error) {
    console.error("Error in POST /journal/add:", error);
    res.status(500).json({ error: "Failed to save journal entry." });
  }
});

// GET /journal/history?userId=...
router.get("/history", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "userId query parameter is required." });
    }

    const entries = await JournalEntry.find({ userId: userId.trim() })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    res.json({ entries });
  } catch (error) {
    console.error("Error in GET /journal/history:", error);
    res.status(500).json({ error: "Failed to retrieve journal history." });
  }
});

export default router;
