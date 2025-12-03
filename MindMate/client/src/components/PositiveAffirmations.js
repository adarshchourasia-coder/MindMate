import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

const fadeInOut = keyframes`
  0% {opacity: 0;}
  10% {opacity: 1;}
  90% {opacity: 1;}
  100% {opacity: 0;}
`;

const AffirmationContainer = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};
  text-align: center;
  margin: 20px 0;
  animation: ${fadeInOut} 10s ease-in-out infinite;
`;

const affirmations = [
  "You are enough just as you are.",
  "This too shall pass.",
  "You are stronger than your struggles.",
  "Your feelings are valid.",
  "Every day is a new beginning.",
  "You deserve kindness and respect.",
  "It's okay to ask for help.",
  "You are not alone.",
  "Progress, not perfection.",
  "Take one step at a time."
];

function PositiveAffirmations() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % affirmations.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <AffirmationContainer aria-live="polite" aria-atomic="true">
      {affirmations[index]}
    </AffirmationContainer>
  );
}

export default PositiveAffirmations;
