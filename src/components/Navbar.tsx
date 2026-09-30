'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getLevelInfo } from '@/lib/types';
import {
  GraduationCap,
  Sparkles,
  Bell,
  Search,
  ChevronDown,
  ShieldAlert,
  UserCheck,
  Code2,
} from 'lucide-react';

export default function Navbar() {
  const { user, usersList, switchUser } = useAuth();
  const levelInfo = user ? getLevelInfo(user.xp) : null;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#991B1B] via-[#8B0000] to-[#E11D48] flex items-center justify-center text-white shadow-md shadow-rose-900/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-[#8B0000] to-[#E11D48] bg-clip-text text-transparent">
                ELITE CLASSROOM
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-[#991B1B]">
                HUB
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Ruang Belajar & Akselerasi Prestasi Siswa & Guru
            </p>
          </div>
        </Link>

        {/* Global Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
          <input
            type="text"
            placeholder="Cari materi video YouTube, modul, kuis, atau lomba..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all text-slate-700 placeholder:text-slate-400"
          />
        </div>

        {/* Right Section: XP Counter, Role Switcher, Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Student XP Counter Pill */}
          {user?.role === 'student' && levelInfo && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 text-rose-700 shadow-xs animate-pulse">
              <Sparkles className="w-4 h-4 text-rose-600 fill-rose-500" />
              <div className="flex items-baseline gap-1">
                <span className="font-extrabold text-xs text-rose-800">{user.xp} XP</span>
                <span className="text-[10px] font-semibold text-rose-500 hidden sm:inline">
                  • {levelInfo.badge}
                </span>
              </div>
            </div>
          )}

          {/* Quick Role Switcher Dropdown (for Evaluator / Juri Testing) */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors">
              <span className="hidden sm:inline text-slate-500">Mode:</span>
              <span className="capitalize font-bold text-[#8B0000]">
                {user?.role === 'student'
                  ? '🎓 Pelajar'
                  : user?.role === 'teacher'
                  ? '👨‍🏫 Guru'
                  : user?.role === 'admin'
                  ? '🛡️ Admin'
                  : '💻 Dev'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-100 p-2 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-2 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                Ganti Role Demo (Pengujian Juri)
              </div>
              {usersList.map((u) => (
                <button
                  key={u.id}
                  onClick={() => switchUser(u.id)}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    user?.id === u.id
                      ? 'bg-rose-50 text-[#8B0000] font-bold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="truncate mr-2">
                    <p className="truncate">{u.name}</p>
                    <p className="text-[10px] text-slate-400 capitalize">
                      {u.role === 'student'
                        ? `Pelajar (${u.className || 'Siswa'})`
                        : u.role === 'teacher'
                        ? `Guru (${u.department || 'Pendidik'})`
                        : u.role}
                    </p>
                  </div>
                  {user?.id === u.id && (
                    <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Notification Bell */}
          <button
            title="Notifikasi"
            className="relative p-2 text-slate-500 hover:text-[#8B0000] hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-600 rounded-full ring-2 ring-white"></span>
          </button>

          {/* User Profile Summary */}
          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8B0000] to-[#F43F5E] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {user.name.charAt(0)}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[120px]">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-500 capitalize">
                  {user.role === 'student' ? user.className || 'Pelajar' : user.role}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
