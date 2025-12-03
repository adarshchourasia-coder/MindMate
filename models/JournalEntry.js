import mongoose from "mongoose";

const { Schema, model } = mongoose;

const JournalEntrySchema = new Schema({
  userId: { type: String, required: true, trim: true },
  moodRating: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
    validate: {
      validator: Number.isInteger,
      message: "Mood rating must be an integer between 1 and 10."
    }
  },
  journalText: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
});

const JournalEntry = model("JournalEntry", JournalEntrySchema);

export default JournalEntry;
