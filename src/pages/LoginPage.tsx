import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { useUser } from "../contexts/UserContext";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  color: white;
`;

const LoginForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  width: 100%;
  max-width: 400px;
  align-items: center;
`;

const Title = styled.h2`
  margin-bottom: 2rem;
  font-size: 1.5rem;
  font-weight: 600;
`;

const LoginPage: React.FC = () => {
  const { login } = useUser();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    try {
      // TODO: 실제 구글 로그인 API 연동
      // 임시 로그인 처리
      console.log(credentialResponse);
      await login("google-user@example.com");
      navigate("/create-card");
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  const handleGoogleError = () => {
    console.error("Google login failed");
  };

  return (
    <LoginContainer>
      <LoginForm>
        <Title>로그인</Title>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap
          theme="filled_blue"
          text="signin_with"
          shape="rectangular"
          locale="ko"
        />
      </LoginForm>
    </LoginContainer>
  );
};

export default LoginPage;
