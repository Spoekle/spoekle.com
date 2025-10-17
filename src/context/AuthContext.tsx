'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { User } from '@/types';
import { cookieUtils } from '@/lib/cookies';

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthLoading: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isAuthLoading: true,
  logout: () => {},
  refreshUser: async () => {},
});

export const useAuth = (): AuthContextType => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  const fetchUser = async (): Promise<void> => {
    setIsAuthLoading(true);
    const token = cookieUtils.get('token');
    
    console.log('AuthContext: Fetching user, token exists:', !!token);
    
    if (token) {
      try {
        const response = await axios.get(`/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('AuthContext: Raw response:', response.data);
        // API responses are wrapped in { success: true, data: {...} }
        const userData = response.data.data || response.data;
        console.log('AuthContext: User data:', userData);
        setUser(userData);
      } catch (error) {
        console.error('AuthContext: Error fetching user:', error);
        cookieUtils.remove('token');
        setUser(null);
      }
    } else {
      console.log('AuthContext: No token found');
    }
    
    setIsAuthLoading(false);
  };

  const extractTokenFromURL = (): void => {
    if (typeof window === 'undefined') return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      cookieUtils.set('token', token, 7); // Set cookie for 7 days
      // Remove token from URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Fetch user after setting token
      fetchUser();
    }
  };

  useEffect(() => {
    extractTokenFromURL();
    fetchUser();
  }, []);

  const logout = (): void => {
    cookieUtils.remove('token');
    setUser(null);
  };

  const refreshUser = async (): Promise<void> => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthLoading,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
