import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const SidebarContainer = styled.nav`
  width: 220px;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    width: 100%;
    flex-direction: row;
    justify-content: space-around;
    padding: 12px 0;
  }
`;

const NavItem = styled(NavLink)`
  text-decoration: none;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 20px;
  padding: 8px 12px;
  border-radius: 8px;
  &.active {
    background-color: ${(props) => props.theme.colors.secondary};
  }
  &:hover:not(.active) {
    background-color: rgba(255, 255, 255, 0.2);
  }
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    margin-bottom: 0;
    font-size: 1rem;
    padding: 8px 10px;
  }
`;

function Sidebar() {
  return (
    <SidebarContainer aria-label="Main Navigation">
      <NavItem to="/chat">Chat</NavItem>
      <NavItem to="/mood-history">Mood Tracker</NavItem>
      <NavItem to="/resources">Resources</NavItem>
      <NavItem to="/settings">Settings</NavItem>
    </SidebarContainer>
  );
}

export default Sidebar;
