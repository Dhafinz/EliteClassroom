'use client';

import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import LoginPage from '@/app/login/page';

function AppContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-slate-500">Memuat Elite Classroom...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, show LoginPage
  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Sidebar docked at the far left edge of the screen */}
      <Sidebar />

      {/* Main Content Area offset by Sidebar width on desktop */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return <AppContent>{children}</AppContent>;
}
