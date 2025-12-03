import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.section`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 0 16px rgb(0 0 0 / 0.1);
  max-height: 90vh;
  overflow-y: auto;
`;

const Title = styled.h2`
  margin: 0 0 24px 0;
  color: ${(props) => props.theme.colors.secondary};
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  color: ${(props) => props.theme.colors.textPrimary};
  font-weight: 600;
  font-size: 1.1rem;
  display: block;
  margin-bottom: 10px;
`;

const ToggleInput = styled.input`
  margin-right: 10px;
  transform: scale(1.2);
  vertical-align: middle;
`;

const Note = styled.p`
  font-size: 0.9rem;
  color: ${(props) => props.theme.colors.textSecondary};
`;

function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Load settings from localStorage
  useEffect(() => {
    const storedDarkMode = localStorage.getItem("mindmateDarkMode");
    const storedNotifications = localStorage.getItem("mindmateNotificationsEnabled");
    if (storedDarkMode !== null) setDarkMode(storedDarkMode === "true");
    if (storedNotifications !== null) setNotificationsEnabled(storedNotifications === "true");
  }, []);

  // Save settings on change
  useEffect(() => {
    localStorage.setItem("mindmateDarkMode", darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("mindmateNotificationsEnabled", notificationsEnabled.toString());
  }, [notificationsEnabled]);

  return (
    <Container aria-label="User Settings">
      <Title>Settings</Title>
      <Section>
        <Label htmlFor="darkModeToggle">
          <ToggleInput
            type="checkbox"
            id="darkModeToggle"
            checked={darkMode}
            onChange={() => setDarkMode((prev) => !prev)}
          />
          Enable Dark Mode (Placeholder)
        </Label>
        <Note>Dark mode feature is not currently implemented.</Note>
      </Section>
      <Section>
        <Label htmlFor="notificationsToggle">
          <ToggleInput
            type="checkbox"
            id="notificationsToggle"
            checked={notificationsEnabled}
            onChange={() => setNotificationsEnabled((prev) => !prev)}
          />
          Enable Notifications (Placeholder)
        </Label>
        <Note>Notification preferences are not currently implemented.</Note>
      </Section>
    </Container>
  );
}

export default Settings;
