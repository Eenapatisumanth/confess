import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { generateAnonymousName } from '../utils/mockData';
import { v4 as uuidv4 } from 'uuid';

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (localStorage)
    const savedUser = localStorage.getItem('vit-verse-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (): Promise<void> => {
    setIsLoading(true);
    
    // Simulate Google OAuth flow
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: uuidv4(),
      googleId: `google_${uuidv4()}`,
      anonymousName: generateAnonymousName(),
      email: `user${Math.floor(Math.random() * 1000)}@vitbhopal.ac.in`,
      createdAt: new Date().toISOString(),
      confessionHistory: []
    };
    
    localStorage.setItem('vit-verse-user', JSON.stringify(newUser));
    setUser(newUser);
    setIsLoading(false);
  };

  const logout = (): void => {
    localStorage.removeItem('vit-verse-user');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};