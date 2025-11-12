import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (name: string, username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authApi.getCurrentUser,
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    } else if (token && !isLoading) {
      // Token exists but user fetch failed, clear it
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [currentUser, token, isLoading]);

  const login = async (username: string, password: string) => {
    try {
      const response = await authApi.login({ username, password });
      localStorage.setItem('token', response.token);
      setUser(response.user);
      queryClient.setQueryData(['currentUser'], response.user);
      navigate('/home');
    } catch (error: any) {
      // Re-throw the error so the LoginPage can handle it
      throw error;
    }
  };

  const signup = async (name: string, username: string, password: string) => {
    const response = await authApi.signup({ name, username, password, passwordConfirmation: password });
    localStorage.setItem('token', response.token);
    setUser(response.user);
    queryClient.setQueryData(['currentUser'], response.user);
    navigate('/home');
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    queryClient.clear();
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

