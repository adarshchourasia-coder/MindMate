import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { sendMessage } from "../api/api.js";

const ChatContainer = styled.section`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 90vh;
  border-radius: 12px;
  background-color: white;
  box-shadow: 0 0 16px rgb(0 0 0 / 0.1);
`;

const MessagesContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const MessageBubble = styled.div`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 20px;
  background-color: ${(props) =>
    props.sender === "user"
      ? props.theme.colors.bubbleUser
      : props.theme.colors.bubbleBot};
  color: ${(props) =>
    props.sender === "user"
      ? props.theme.colors.secondary
      : props.theme.colors.textPrimary};
  align-self: ${(props) => (props.sender === "user" ? "flex-end" : "flex-start")};
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
  white-space: pre-wrap;
  font-size: 1rem;
  line-height: 1.4;
`;

const TypingBubble = styled(MessageBubble)`
  font-style: italic;
  opacity: 0.7;
  position: relative;
  &::after {
    content: "...";
    animation: blink 1.5s infinite;
    position: absolute;
    right: 16px;
  }
  @keyframes blink {
    0%, 100% {opacity: 0;}
    50% {opacity: 1;}
  }
`;

const QuickRepliesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 8px 16px 16px;
`;

const QuickReplyButton = styled.button`
  background-color: ${(props) => props.theme.colors.accent};
  border: none;
  border-radius: 18px;
  padding: 8px 14px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  user-select: none;

  &:hover {
    background-color: #d98e3b;
  }
  &:focus {
    outline: 2px solid ${(props) => props.theme.colors.secondary};
    outline-offset: 2px;
  }
`;

const InputForm = styled.form`
  display: flex;
  padding: 12px 16px;
  border-top: 1px solid #ccc;
  background-color: ${(props) => props.theme.colors.bubbleBot};
`;

const TextInput = styled.textarea`
  flex-grow: 1;
  resize: none;
  border-radius: 18px;
  border: 1.5px solid #ccc;
  padding: 10px 16px;
  font-size: 1rem;
  font-family: inherit;
  min-height: 50px;
  max-height: 120px;
  line-height: 1.3;
  color: ${(props) => props.theme.colors.textPrimary};
  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
    outline: none;
  }
`;

const SendButton = styled.button`
  margin-left: 12px;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  border: none;
  border-radius: 18px;
  padding: 0 18px;
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

const CrisisBox = styled.div`
  background-color: #ffdad6;
  color: #8b0000;
  border: 2px solid #8b0000;
  border-radius: 12px;
  padding: 16px;
  margin: 0 16px 16px;
  font-size: 1rem;
  font-weight: 600;
`;

const quickRepliesData = [
  { label: "Daily Check-in", message: "Hi, how am I feeling today?" },
  { label: "Mood Rating", message: "I want to rate my mood from 1 to 10." },
  { label: "Anxiety Relief", message: "I am feeling anxious, can you help me relax?" },
  { label: "Sleep Support", message: "I have trouble sleeping, any tips?" },
  { label: "Relationship Stress", message: "I'm stressed about my relationship." },
  { label: "Deep Breathing", message: "Guide me through a deep breathing exercise." },
  { label: "Positive Affirmations", message: "Give me some positive affirmations." },
  { label: "Journaling Prompts", message: "Can you give me some journaling prompts?" }
];

function Chat() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I'm MindMate, your mental health support chatbot. How can I assist you today?",
      typing: false,
      quickReplies: quickRepliesData.map((qr) => qr.label)
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Generate or reuse userId for anonymous mode (localStorage)
  const userIdKey = "mindmateUserId";
  const [userId] = useState(() => {
    let stored = localStorage.getItem(userIdKey);
    if (!stored) {
      stored = crypto.randomUUID();
      localStorage.setItem(userIdKey, stored);
    }
    return stored;
  });

  // Scroll to bottom on new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (msgText) => {
    if (!msgText.trim()) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: msgText.trim(), typing: false, quickReplies: [] }
    ]);
    setInputText("");
    setIsTyping(true);

    try {
      const response = await sendMessage(msgText.trim(), userId);

      if (response.crisis) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: `${response.reply}\n\nHotline: ${response.hotline.name} - ${response.hotline.phone}`,
            typing: false,
            quickReplies: []
          }
        ]);
      } else {
        // Show typing animation briefly before showing bot reply
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "", typing: true, quickReplies: [] }
        ]);
        await new Promise((r) => setTimeout(r, 1500));

        setMessages((prev) => {
          // Replace last typing message with actual reply
          const newMessages = [...prev];
          const typingIndex = newMessages.findIndex((m) => m.typing && m.sender === "bot");
          if (typingIndex !== -1) {
            newMessages[typingIndex] = {
              sender: "bot",
              text: response.reply,
              typing: false,
              quickReplies: quickRepliesData.map((qr) => qr.label)
            };
          } else {
            newMessages.push({
              sender: "bot",
              text: response.reply,
              typing: false,
              quickReplies: quickRepliesData.map((qr) => qr.label)
            });
          }
          return newMessages;
        });
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            "Sorry, I encountered an error processing your message. Please try again later.",
          typing: false,
          quickReplies: []
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isTyping) return;
    handleSendMessage(inputText);
  };

  const handleQuickReplyClick = (label) => {
    const quickReply = quickRepliesData.find((qr) => qr.label === label);
    if (quickReply) {
      handleSendMessage(quickReply.message);
    }
  };

  return (
    <ChatContainer aria-label="MindMate Chatbot">
      <MessagesContainer aria-live="polite" aria-relevant="additions">
        {messages.map((msg, i) => (
          <React.Fragment key={i}>
            <MessageBubble sender={msg.sender} aria-label={`${msg.sender} message`}>
              {msg.typing ? (
                <span aria-live="assertive" aria-atomic="true">
                  MindMate is typing...
                </span>
              ) : (
                msg.text
              )}
            </MessageBubble>
            {msg.quickReplies && msg.quickReplies.length > 0 && (
              <QuickRepliesContainer aria-label="Quick reply options">
                {msg.quickReplies.map((qr) => (
                  <QuickReplyButton
                    key={qr}
                    type="button"
                    onClick={() => handleQuickReplyClick(qr)}
                  >
                    {qr}
                  </QuickReplyButton>
                ))}
              </QuickRepliesContainer>
            )}
            {msg.crisis && msg.hotline && (
              <CrisisBox role="alert" aria-live="assertive">
                Crisis detected. Please call {msg.hotline.name} at {msg.hotline.phone} immediately.
              </CrisisBox>
            )}
          </React.Fragment>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      <InputForm onSubmit={handleSubmit} aria-label="Send message form">
        <TextInput
          aria-label="Type your message"
          placeholder="Type your message here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isTyping}
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <SendButton type="submit" disabled={isTyping || !inputText.trim()}>
          Send
        </SendButton>
      </InputForm>
    </ChatContainer>
  );
}

export default Chat;
