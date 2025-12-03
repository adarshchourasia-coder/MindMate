import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";

import Sidebar from "./components/Sidebar.js";
import Chat from "./components/Chat.js";
import MoodHistory from "./components/MoodHistory.js";
import Resources from "./components/Resources.js";
import Settings from "./components/Settings.js";
import Disclaimer from "./components/Disclaimer.js";

const theme = {
  colors: {
    primary: "#2a9d8f", // calming teal
    secondary: "#264653", // dark blue-green
    background: "#e0f2f1", // light teal background
    textPrimary: "#264653",
    textSecondary: "#555",
    accent: "#f4a261", // warm accent
    bubbleUser: "#a0d8d3",
    bubbleBot: "#f1f6f9"
  },
  breakpoints: {
    mobile: "600px"
  }
};

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    background-color: ${(props) => props.theme.colors.background};
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: ${(props) => props.theme.colors.textPrimary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  * {
    box-sizing: border-box;
  }
`;

const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const MainContent = styled.main`
  flex-grow: 1;
  padding: 16px;
  background-color: ${(props) => props.theme.colors.bubbleBot};
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <Layout>
          <Sidebar />
          <MainContent>
            <Routes>
              <Route path="/" element={<Navigate to="/chat" replace />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/mood-history" element={<MoodHistory />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/chat" replace />} />
            </Routes>
            <Disclaimer />
          </MainContent>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
