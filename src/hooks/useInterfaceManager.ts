import { useState, useEffect, useCallback, useRef } from 'react';

interface InterfaceState {
  isActive: boolean;
  isVisible: boolean;
}

const INACTIVITY_TIMEOUT = 1000; // 3초 후 인터페이스 비활성화
const TRANSITION_DURATION = 300; // 트랜지션 지속 시간 (ms)

export const useInterfaceManager = () => {
  const [state, setState] = useState<InterfaceState>({
    isActive: false,
    isVisible: false,
  });
  const timeoutRef = useRef<number[]>([]);

  const clearAllTimeouts = useCallback(() => {
    timeoutRef.current.forEach(id => clearTimeout(id));
    timeoutRef.current = [];
  }, []);

  const activateInterface = useCallback(() => {
    setState(prev => ({ ...prev, isActive: true, isVisible: true }));
    
    // 이전 타임아웃들 모두 제거
    clearAllTimeouts();

    // 비활성화 타임아웃 설정
    const deactivateTimeoutId = window.setTimeout(() => {
      setState(prev => ({ ...prev, isActive: false }));
      
      // 숨김 타임아웃 설정
      const hideTimeoutId = window.setTimeout(() => {
        setState(prev => ({ ...prev, isVisible: false }));
      }, TRANSITION_DURATION);

      timeoutRef.current.push(hideTimeoutId);
    }, INACTIVITY_TIMEOUT);

    timeoutRef.current.push(deactivateTimeoutId);
  }, [clearAllTimeouts]);

  const handleInteraction = useCallback(() => {
    activateInterface();
  }, [activateInterface]);

  // 컴포넌트 언마운트 시 모든 타임아웃 정리
  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  return {
    isActive: state.isActive,
    isVisible: state.isVisible,
    handleInteraction,
  };
}; 