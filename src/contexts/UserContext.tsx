import React, { createContext, useContext, useState, useCallback } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  hasBusinessCard: boolean;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  createBusinessCard: () => Promise<void>;
  checkUsernameAvailability: (username: string) => Promise<boolean>;
  updateUsername: (username: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    // TODO: 실제 로그인 API 연동
    // 임시 로그인 로직
    setUser({
      id: "1",
      name: "홍길동",
      email,
      username: "",
      hasBusinessCard: false,
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const createBusinessCard = useCallback(async () => {
    if (!user) return;
    // TODO: 실제 명함 생성 API 연동
    setUser((prev) => (prev ? { ...prev, hasBusinessCard: true } : null));
  }, [user]);

  const checkUsernameAvailability = useCallback(async (username: string) => {
    // TODO: 실제 API 연동
    // 임시 중복 체크 로직
    const takenUsernames = ["john", "jane", "admin"];
    return !takenUsernames.includes(username);
  }, []);

  const updateUsername = useCallback(
    async (username: string) => {
      if (!user) return;
      // TODO: 실제 API 연동
      setUser((prev) => (prev ? { ...prev, username } : null));
    },
    [user]
  );

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        createBusinessCard,
        checkUsernameAvailability,
        updateUsername,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
