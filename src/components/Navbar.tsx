'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getLevelInfo } from '@/lib/types';
import {
  Sparkles,
  Bell,
  Search,
  ChevronDown,
  CheckCircle2,
  ExternalLink,
  LogOut,
  User as UserIcon,
} from 'lucide-react';

export default function Navbar() {
  const {
    user,
    usersList,
    switchUser,
    notifications,
    unreadNotificationCount,
    markAsRead,
    markAllAsRead,
    logout,
  } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const levelInfo = user ? getLevelInfo(user.xp) : null;

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="flex items-center flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
          <input
            type="text"
            placeholder="Cari materi pembelajaran, modul Word/PDF, kuis, atau lomba..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all text-slate-700 placeholder:text-slate-400"
          />
        </div>

        {/* Right Section: XP Counter, Notifications, Role Switcher, Profile */}
        <div className="flex items-center gap-3">
          {/* Student XP Counter Pill */}
          {user?.role === 'student' && levelInfo && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 text-rose-700 shadow-xs">
              <Sparkles className="w-4 h-4 text-rose-600 fill-rose-500 animate-pulse" />
              <div className="flex items-baseline gap-1">
                <span className="font-extrabold text-xs text-rose-800">{user.xp} XP</span>
                <span className="text-[10px] font-semibold text-rose-500 hidden sm:inline">
                  • {levelInfo.badge}
                </span>
              </div>
            </div>
          )}

          {/* Interactive Notification Bell with Dropdown Popover */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifikasi"
              className="relative p-2 text-slate-500 hover:text-[#8B0000] hover:bg-rose-50 rounded-xl transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-white">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {/* Notification Popover Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-rose-600" />
                    <h4 className="text-xs font-bold text-slate-800">
                      Notifikasi Aktivitas ({notifications.length})
                    </h4>
                  </div>
                  {unreadNotificationCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 hover:underline"
                    >
                      Tandai Semua Dibaca
                    </button>
                  )}
                </div>

                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto mt-2">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs italic">
                      Tidak ada notifikasi baru saat ini.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markAsRead(n.id)}
                        className={`p-3 rounded-xl transition-colors cursor-pointer text-left ${
                          !n.isRead ? 'bg-rose-50/60 font-semibold' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-bold text-slate-800">{n.title}</p>
                          {!n.isRead && (
                            <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0 mt-1"></span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                          {n.message}
                        </p>
                        {n.link && (
                          <Link
                            href={n.link}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 hover:underline mt-1.5"
                          >
                            <span>Buka Halaman Terkait</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Role Switcher Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors">
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
            <div className="absolute right-0 mt-1 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 hidden group-hover:block z-50">
              <div className="px-2 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                Ganti Role Demo (Pengujian Juri)
              </div>
              {usersList.map((u) => (
                <button
                  key={u.id}
                  onClick={() => switchUser(u.id)}
                  className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    user?.id === u.id
                      ? 'bg-rose-50 text-[#8B0000] font-bold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="truncate mr-2">
                    <p className="truncate font-semibold">{u.name}</p>
                    <p className="text-[10px] text-slate-400 capitalize truncate">
                      {u.email}
                    </p>
                  </div>
                  {user?.id === u.id && (
                    <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* User Profile & Logout */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8B0000] to-[#F43F5E] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {user.name.charAt(0)}
              </div>
              <button
                onClick={logout}
                title="Keluar Akun"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="btn-primary-crimson text-xs py-1.5 px-3"
            >
              Masuk
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
