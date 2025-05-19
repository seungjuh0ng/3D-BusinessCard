import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { useUser } from '../contexts/UserContext';
import debounce from 'lodash/debounce';

const CreateCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  color: white;
`;

const CardForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  width: 100%;
  max-width: 600px;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  padding: 0.8rem;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
`;

const Button = styled.button`
  padding: 0.8rem;
  border: none;
  border-radius: 4px;
  background: #007AFF;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #0056b3;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

interface UsernameInputProps {
  available?: boolean;
}

const UsernameInput = styled(Input)<UsernameInputProps>`
  border: 2px solid ${props => props.available === undefined ? 'transparent' : props.available ? '#4CAF50' : '#f44336'};
`;

const StatusMessage = styled.span<{ available?: boolean }>`
  font-size: 0.875rem;
  color: ${props => props.available === undefined ? 'transparent' : props.available ? '#4CAF50' : '#f44336'};
`;

const CreateCardPage: React.FC = () => {
  const { user, createBusinessCard, checkUsernameAvailability, updateUsername } = useUser();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | undefined>(undefined);
  const [isChecking, setIsChecking] = useState(false);

  const checkUsername = useCallback(
    debounce(async (value: string) => {
      if (!value) {
        setIsUsernameAvailable(undefined);
        return;
      }
      setIsChecking(true);
      try {
        const available = await checkUsernameAvailability(value);
        setIsUsernameAvailable(available);
      } catch (error) {
        console.error('Failed to check username:', error);
        setIsUsernameAvailable(false);
      } finally {
        setIsChecking(false);
      }
    }, 500),
    [checkUsernameAvailability]
  );

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    checkUsername(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUsernameAvailable) return;

    try {
      await updateUsername(username);
      await createBusinessCard();
      navigate(`/${username}`);
    } catch (error) {
      console.error('Failed to create business card:', error);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <CreateCardContainer>
      <CardForm onSubmit={handleSubmit}>
        <h2>명함 만들기</h2>
        <InputGroup>
          <UsernameInput
            type="text"
            placeholder="사용자 이름 (URL에 사용됨)"
            value={username}
            onChange={handleUsernameChange}
            required
            available={isUsernameAvailable}
          />
          <StatusMessage available={isUsernameAvailable}>
            {isChecking
              ? '확인 중...'
              : isUsernameAvailable === undefined
              ? ''
              : isUsernameAvailable
              ? '사용 가능한 사용자 이름입니다'
              : '이미 사용 중인 사용자 이름입니다'}
          </StatusMessage>
        </InputGroup>
        <Input
          type="text"
          placeholder="이름"
          defaultValue={user.name}
          required
        />
        <Input
          type="text"
          placeholder="직책"
          required
        />
        <Input
          type="text"
          placeholder="회사"
          required
        />
        <Input
          type="email"
          placeholder="이메일"
          defaultValue={user.email}
          required
        />
        <Input
          type="tel"
          placeholder="전화번호"
          required
        />
        <TextArea
          placeholder="자기소개"
          required
        />
        <Button 
          type="submit"
          disabled={!isUsernameAvailable || isChecking}
        >
          명함 생성하기
        </Button>
      </CardForm>
    </CreateCardContainer>
  );
};

export default CreateCardPage; 