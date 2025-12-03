import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Chat from "../client/src/components/Chat.js";
import * as api from "../client/src/api/api.js";

jest.mock("../client/src/api/api.js");

describe("Chat Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage userId
    Storage.prototype.getItem = jest.fn(() => "test-user-id");
  });

  test("renders initial bot message and quick replies", () => {
    render(<Chat />);
    const botMessage = screen.getByText(/mindmate, your mental health support chatbot/i);
    expect(botMessage).toBeInTheDocument();

    quickRepliesCheck();
  });

  test("user can send message and receive bot reply", async () => {
    api.sendMessage.mockResolvedValue({
      reply: "This is a test reply.",
      crisis: false,
      hotline: null
    });

    render(<Chat />);
    const textarea = screen.getByLabelText(/type your message/i);
    const sendButton = screen.getByRole("button", { name: /send/i });

    fireEvent.change(textarea, { target: { value: "Hello bot" } });
    fireEvent.click(sendButton);

    expect(api.sendMessage).toHaveBeenCalledWith("Hello bot", "test-user-id");

    // Wait for bot reply
    await waitFor(() => {
      const botReply = screen.getByText("This is a test reply.");
      expect(botReply).toBeInTheDocument();
    });
  });

  test("typing animation shows while awaiting reply", async () => {
    let resolvePromise;
    api.sendMessage.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePromise = resolve;
        })
    );

    render(<Chat />);
    const textarea = screen.getByLabelText(/type your message/i);
    const sendButton = screen.getByRole("button", { name: /send/i });

    fireEvent.change(textarea, { target: { value: "Test typing" } });
    fireEvent.click(sendButton);

    // Typing indicator should appear
    const typingIndicator = await screen.findByText(/mindmate is typing/i);
    expect(typingIndicator).toBeInTheDocument();

    // Resolve API call
    resolvePromise({
      reply: "Typing finished.",
      crisis: false,
      hotline: null
    });

    // Wait for typing indicator to be replaced
    await waitFor(() => {
      expect(screen.queryByText(/mindmate is typing/i)).not.toBeInTheDocument();
      expect(screen.getByText("Typing finished.")).toBeInTheDocument();
    });
  });

  test("displays crisis message and hotline info", async () => {
    api.sendMessage.mockResolvedValue({
      reply: "Please call the hotline immediately.",
      crisis: true,
      hotline: { phone: "1-800-273-8255", name: "Lifeline" }
    });

    render(<Chat />);
    const textarea = screen.getByLabelText(/type your message/i);
    const sendButton = screen.getByRole("button", { name: /send/i });

    fireEvent.change(textarea, { target: { value: "I want to die" } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/please call the hotline immediately/i)).toBeInTheDocument();
      expect(screen.getByText(/lifeline - 1-800-273-8255/i)).toBeInTheDocument();
    });
  });

  test("quick reply buttons send correct messages", async () => {
    api.sendMessage.mockResolvedValue({
      reply: "Reply to quick reply.",
      crisis: false,
      hotline: null
    });

    render(<Chat />);

    // Quick reply buttons appear after initial bot message
    await waitFor(() => {
      quickRepliesCheck();
    });

    const quickReplyButton = screen.getByRole("button", { name: /daily check-in/i });
    fireEvent.click(quickReplyButton);

    await waitFor(() => {
      expect(api.sendMessage).toHaveBeenCalledWith("Hi, how am I feeling today?", "test-user-id");
      expect(screen.getByText("Reply to quick reply.")).toBeInTheDocument();
    });
  });
});

function quickRepliesCheck() {
  const labels = [
    "Daily Check-in",
    "Mood Rating",
    "Anxiety Relief",
    "Sleep Support",
    "Relationship Stress",
    "Deep Breathing",
    "Positive Affirmations",
    "Journaling Prompts"
  ];
  labels.forEach((label) => {
    expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
  });
}
