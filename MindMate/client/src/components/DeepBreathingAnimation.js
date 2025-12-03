import React from "react";
import { useSpring, animated } from "react-spring";
import styled from "styled-components";

const Circle = styled(animated.div)`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.primary};
  margin: 0 auto;
`;

const Instruction = styled.p`
  text-align: center;
  color: ${(props) => props.theme.colors.secondary};
  font-weight: 600;
  margin-top: 12px;
  font-size: 1.1rem;
`;

function DeepBreathingAnimation() {
  const breathing = useSpring({
    loop: { reverse: true },
    from: { scale: 1 },
    to: { scale: 1.4 },
    config: { duration: 4000 }
  });

  return (
    <div aria-label="Deep Breathing Animation" role="img" aria-roledescription="animated circle">
      <Circle style={{ transform: breathing.scale.to((s) => `scale(${s})`) }} />
      <Instruction>Breathe in... Breathe out...</Instruction>
    </div>
  );
}

export default DeepBreathingAnimation;
