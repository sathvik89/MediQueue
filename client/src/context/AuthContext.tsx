import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, AuthState, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check localStorage for mocked session
    const storedUser = localStorage.getItem('mediQueue_user');
    if (storedUser) {
      setAuthState({
        user: JSON.parse(storedUser),
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = (user: User) => {
    localStorage.setItem('mediQueue_user', JSON.stringify(user));
    setAuthState({ user, isAuthenticated: true, isLoading: false });
  };

  const logout = () => {
    localStorage.removeItem('mediQueue_user');
    setAuthState({ user: null, isAuthenticated: false, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
