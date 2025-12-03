import React from "react";
import styled from "styled-components";

const DisclaimerContainer = styled.footer`
  margin-top: auto;
  padding: 12px 16px;
  background-color: transparent;
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  text-align: center;
  user-select: none;
`;

function Disclaimer() {
  return (
    <DisclaimerContainer aria-label="Disclaimer">
      Not medical advice. If you are in crisis, please contact emergency services immediately.
    </DisclaimerContainer>
  );
}

export default Disclaimer;
