import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  name: string;
  profileImage: string | null;
}

interface ContextType {
  user: User;
  setProfileImage: (img: string) => void;
}

const UserContext = createContext<ContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('zameen_user');
    return saved ? JSON.parse(saved) : { name: 'Ahmed Malik', profileImage: null };
  });

  useEffect(() => {
    localStorage.setItem('zameen_user', JSON.stringify(user));
  }, [user]);

  const setProfileImage = (img: string) => {
    setUser((prev) => ({ ...prev, profileImage: img }));
  };

  return (
    <UserContext.Provider value={{ user, setProfileImage }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
};