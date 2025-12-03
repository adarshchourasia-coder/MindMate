import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { getJournalHistory } from "../api/api.js";

const Container = styled.section`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 0 16px rgb(0 0 0 / 0.1);
  height: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  margin: 0 0 16px 0;
  color: ${(props) => props.theme.colors.secondary};
`;

const Message = styled.p`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 1rem;
`;

const ChartWrapper = styled.div`
  flex-grow: 1;
  min-height: 300px;
`;

function MoodHistory() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);
  const userIdKey = "mindmateUserId";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUserId = localStorage.getItem(userIdKey);
        if (!storedUserId) {
          setError("No user ID found. Please start a chat first.");
          return;
        }
        const data = await getJournalHistory(storedUserId);
        if (data.entries && Array.isArray(data.entries)) {
          // Format data for chart
          const formatted = data.entries
            .map((e) => ({
              date: new Date(e.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric"
              }),
              moodRating: e.moodRating
            }))
            .reverse(); // oldest first for chart
          setEntries(formatted);
        } else {
          setError("No journal entries found.");
        }
      } catch (err) {
        setError("Failed to fetch mood history.");
      }
    };
    fetchData();
  }, []);

  return (
    <Container aria-label="Mood History">
      <Title>Your Mood History</Title>
      {error && <Message role="alert">{error}</Message>}
      {!error && entries.length === 0 && <Message>No mood entries yet.</Message>}
      {!error && entries.length > 0 && (
        <ChartWrapper>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={entries} margin={{ top: 20, right: 40, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[1, 10]} tickCount={10} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="moodRating"
                stroke={props => props.theme.colors.primary}
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartWrapper>
      )}
    </Container>
  );
}

export default MoodHistory;
