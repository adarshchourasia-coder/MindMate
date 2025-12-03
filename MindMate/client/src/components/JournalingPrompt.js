import React, { useState } from "react";
import styled from "styled-components";
import { addJournalEntry } from "../api/api.js";

const Container = styled.section`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 0 16px rgb(0 0 0 / 0.1);
  max-width: 600px;
  margin: 24px auto;
`;

const Title = styled.h2`
  color: ${(props) => props.theme.colors.secondary};
  margin-bottom: 16px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Label = styled.label`
  font-weight: 600;
  color: ${(props) => props.theme.colors.textPrimary};
`;

const TextArea = styled.textarea`
  resize: vertical;
  min-height: 100px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1.5px solid #ccc;
  font-size: 1rem;
  font-family: inherit;
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

const InputNumber = styled.input`
  width: 80px;
  padding: 6px 10px;
  font-size: 1rem;
  border-radius: 8px;
  border: 1.5px solid #ccc;
  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

const Button = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  border: none;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  padding: 12px;
  border-radius: 18px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s ease;
  &:hover:enabled {
    background-color: #247a72;
  }
  &:disabled {
    background-color: #a7c6bf;
    cursor: not-allowed;
  }
  &:focus {
    outline: 2px solid ${(props) => props.theme.colors.secondary};
    outline-offset: 2px;
  }
`;

const Message = styled.p`
  text-align: center;
  color: ${(props) => (props.error ? "#b00020" : "green")};
  font-weight: 600;
  margin-top: 8px;
`;

function JournalingPrompt() {
  const [moodRating, setMoodRating] = useState("");
  const [journalText, setJournalText] = useState("");
  const [statusMessage, setStatusMessage] = useState(null);
  const [statusError, setStatusError] = useState(false);
  const userIdKey = "mindmateUserId";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage(null);
    setStatusError(false);

    const mood = Number(moodRating);
    if (!Number.isInteger(mood) || mood < 1 || mood > 10) {
      setStatusError(true);
      setStatusMessage("Mood rating must be an integer between 1 and 10.");
      return;
    }
    if (!journalText.trim()) {
      setStatusError(true);
      setStatusMessage("Please enter your journal text.");
      return;
    }

    const storedUserId = localStorage.getItem(userIdKey);
    if (!storedUserId) {
      setStatusError(true);
      setStatusMessage("User ID missing, please start a chat first.");
      return;
    }

    try {
      await addJournalEntry(storedUserId, mood, journalText.trim());
      setStatusMessage("Journal entry saved successfully.");
      setMoodRating("");
      setJournalText("");
    } catch (error) {
      setStatusError(true);
      setStatusMessage("Failed to save journal entry. Please try again.");
    }
  };

  return (
    <Container aria-label="Journaling Prompt">
      <Title>Daily Journaling Prompt</Title>
      <Form onSubmit={handleSubmit}>
        <Label htmlFor="moodRatingInput">Mood Rating (1-10):</Label>
        <InputNumber
          id="moodRatingInput"
          type="number"
          min="1"
          max="10"
          value={moodRating}
          onChange={(e) => setMoodRating(e.target.value)}
          required
          aria-required="true"
        />
        <Label htmlFor="journalTextArea">Journal Entry:</Label>
        <TextArea
          id="journalTextArea"
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
          required
          aria-required="true"
          placeholder="Write about your thoughts or feelings today..."
        />
        <Button type="submit">Save Entry</Button>
      </Form>
      {statusMessage && <Message error={statusError}>{statusMessage}</Message>}
    </Container>
  );
}

export default JournalingPrompt;
