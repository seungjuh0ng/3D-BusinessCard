import React from "react";
import styled from "@emotion/styled";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

interface InterfaceOverlayProps {
  isActive: boolean;
  isVisible: boolean;
}

const OverlayContainer = styled.div<InterfaceOverlayProps>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1000;
`;

const InterfaceWrapper = styled.div<InterfaceOverlayProps>`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  opacity: ${(props) => (props.isActive ? 1 : 0)};
  transform: translateX(${(props) => (props.isActive ? "0" : "100%")});
  transition: all 0.3s ease;
  pointer-events: ${(props) => (props.isActive ? "auto" : "none")};
`;

const Button = styled.button`
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

const InterfaceOverlay: React.FC<InterfaceOverlayProps> = ({
  isActive,
  isVisible,
}) => {
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const isViewingOthersCard = location.pathname.startsWith("/card/");

  const handleCreateCard = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate("/create-card");
    }
  };

  const handleShareCard = () => {
    // TODO: 명함 공유 로직 구현
    console.log("Share business card");
  };

  if (!isVisible) return null;

  return (
    <OverlayContainer isActive={isActive} isVisible={isVisible}>
      <InterfaceWrapper isActive={isActive} isVisible={isVisible}>
        <Button onClick={handleCreateCard}>
          {isAuthenticated ? "명함 만들기" : "로그인하고 명함 만들기"}
        </Button>
        {(!isAuthenticated || isViewingOthersCard) && (
          <Button onClick={handleShareCard}>명함 주고받기</Button>
        )}
      </InterfaceWrapper>
    </OverlayContainer>
  );
};

export default InterfaceOverlay;
