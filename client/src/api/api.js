import axios from "axios";

const baseURL = process.env.REACT_APP_API_BASE_URL || "";

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json"
  }
});

export async function sendMessage(message, userId) {
  if (!message || typeof message !== "string") {
    throw new Error("Message must be a non-empty string.");
  }
  try {
    const response = await api.post("/chat", { message, userId });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function addJournalEntry(userId, moodRating, journalText) {
  if (
    !userId ||
    typeof userId !== "string" ||
    !moodRating ||
    !Number.isInteger(moodRating) ||
    moodRating < 1 ||
    moodRating > 10 ||
    !journalText ||
    typeof journalText !== "string"
  ) {
    throw new Error("Invalid input to addJournalEntry.");
  }
  try {
    const response = await api.post("/journal/add", {
      userId,
      moodRating,
      journalText
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

export async function getJournalHistory(userId) {
  if (!userId || typeof userId !== "string") {
    throw new Error("userId must be a non-empty string.");
  }
  try {
    const response = await api.get("/journal/history", {
      params: { userId }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}
