import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType } from '../types/context';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'auth_user';

/**
 * AuthProvider manages authentication state and provides login, logout, and registration actions.
 * Persists user state to localStorage.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  // Persist user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  // Simulated login (replace with real API in production)
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise(res => setTimeout(res, 500));
      setUser({
        id: 'demo-user',
        name: 'Demo User',
        email,
        role: 'customer',
        address: '123 Main St',
        orderIds: [],
        wishlistProductIds: [],
      });
    } catch (e) {
      setError('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  // Simulated registration (replace with real API in production)
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise(res => setTimeout(res, 500));
      setUser({
        id: 'demo-user',
        name,
        email,
        role: 'customer',
        address: '',
        orderIds: [],
        wishlistProductIds: [],
      });
    } catch (e) {
      setError('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth provides access to the authentication context.
 * Throws if used outside an AuthProvider.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
} 