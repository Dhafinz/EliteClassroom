'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserSession } from '@/lib/types';
import { markNotificationAsRead, markAllNotificationsAsRead } from '@/app/actions/chat';

export interface AppNotification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: string;
  link?: string | null;
  isRead: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: UserSession | null;
  usersList: UserSession[];
  notifications: AppNotification[];
  unreadNotificationCount: number;
  setUser: (user: UserSession) => void;
  switchUser: (userId: number) => void;
  login: (email: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  refreshUserData: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<UserSession | null>(null);
  const [usersList, setUsersList] = useState<UserSession[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data: UserSession[] = await res.json();
        setUsersList(data);

        // Check if there is saved user in localStorage
        const savedId = localStorage.getItem('elite_active_user_id');
        if (savedId) {
          const found = data.find((u) => u.id === Number(savedId));
          if (found) {
            setUserState(found);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNotifications = async (userId: number) => {
    try {
      const res = await fetch(`/api/notifications?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotifications(user.id);
    } else {
      setNotifications([]);
    }
  }, [user]);

  const switchUser = (userId: number) => {
    const selected = usersList.find((u) => u.id === userId);
    if (selected) {
      setUserState(selected);
      localStorage.setItem('elite_active_user_id', String(userId));
      fetchNotifications(userId);
    }
  };

  const login = async (email: string) => {
    const trimmed = email.trim().toLowerCase();
    const found = usersList.find((u) => u.email.toLowerCase() === trimmed);
    if (found) {
      setUserState(found);
      localStorage.setItem('elite_active_user_id', String(found.id));
      fetchNotifications(found.id);
      return { success: true, message: `Selamat datang kembali, ${found.name}!` };
    }
    return { success: false, message: 'Email tidak ditemukan di sistem. Silakan pilih akun demo di bawah.' };
  };

  const logout = () => {
    setUserState(null);
    localStorage.removeItem('elite_active_user_id');
    setNotifications([]);
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
      fetchNotifications(user.id);
    } catch (err) {
      console.error('Failed to refresh user', err);
    }
  };

  const refreshNotifications = async () => {
    if (user) {
      await fetchNotifications(user.id);
    }
  };

  const markAsRead = async (id: number) => {
    await markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = async () => {
    if (user) {
      await markAllNotificationsAsRead(user.id);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    }
  };

  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AuthContext.Provider
      value={{
        user,
        usersList,
        notifications,
        unreadNotificationCount,
        setUser,
        switchUser,
        login,
        logout,
        refreshUserData,
        refreshNotifications,
        markAsRead,
        markAllAsRead,
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
