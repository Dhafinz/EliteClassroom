'use client';

import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { AuthProvider } from '@/context/AuthContext';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Navbar />
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-6">
            <Sidebar />
            <main className="flex-1 min-w-0">{children}</main>
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}
