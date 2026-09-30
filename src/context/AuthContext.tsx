'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserSession } from '@/lib/types';

interface AuthContextType {
  user: UserSession | null;
  usersList: UserSession[];
  setUser: (user: UserSession) => void;
  switchUser: (userId: number) => void;
  refreshUserData: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<UserSession | null>(null);
  const [usersList, setUsersList] = useState<UserSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data: UserSession[] = await res.json();
        setUsersList(data);

        // Check if there is saved user in localStorage, else default to student (Ahmad Rizky)
        const savedId = localStorage.getItem('elite_active_user_id');
        const defaultUser =
          data.find((u) => u.id === Number(savedId)) ||
          data.find((u) => u.role === 'student') ||
          data[0];

        if (defaultUser) {
          setUserState(defaultUser);
        }
      }
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const switchUser = (userId: number) => {
    const selected = usersList.find((u) => u.id === userId);
    if (selected) {
      setUserState(selected);
      localStorage.setItem('elite_active_user_id', String(userId));
    }
  };

  const setUser = (newUser: UserSession) => {
    setUserState(newUser);
    localStorage.setItem('elite_active_user_id', String(newUser.id));
  };

  const refreshUserData = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data: UserSession[] = await res.json();
        setUsersList(data);
        const updated = data.find((u) => u.id === user.id);
        if (updated) {
          setUserState(updated);
        }
      }
    } catch (err) {
      console.error('Failed to refresh user', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        usersList,
        setUser,
        switchUser,
        refreshUserData,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
