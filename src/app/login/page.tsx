'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  User,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // If already logged in, redirect to home
  React.useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const res = await login(email);
    if (res.success) {
      router.push('/');
    } else {
      setErrorMsg(res.message);
    }
    setLoading(false);
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setLoading(true);
    setErrorMsg('');

    const res = await login(demoEmail);
    if (res.success) {
      router.push('/');
    } else {
      setErrorMsg(res.message);
    }
    setLoading(false);
  };

  const demoAccounts = [
    {
      role: 'Siswa / Pelajar (Utama)',
      name: 'Dhafin Kautsar',
      email: 'dhafin@eliteclassroom.com',
      nis: '2024001',
      badge: '🎓 Siswa (420 XP • Level 4)',
      bg: 'border-rose-200 bg-rose-50/60 hover:bg-rose-100/80',
      iconColor: 'text-[#8B0000]',
    },
    {
      role: 'Siswa / Pelajar (Partner)',
      name: 'Siti Fatimah Azzahra',
      email: 'siti@eliteclassroom.com',
      nis: '2024102',
      badge: '🎓 Siswa (195 XP • Level 3)',
      bg: 'border-slate-200 bg-slate-50 hover:bg-slate-100',
      iconColor: 'text-rose-600',
    },
    {
      role: 'Guru / Pendidik (Mentor)',
      name: 'Budi Santoso, M.Kom',
      email: 'budi@eliteclassroom.com',
      nis: 'NIP 19850312',
      badge: '👨‍🏫 Guru Rekayasa Perangkat Lunak',
      bg: 'border-blue-200 bg-blue-50/60 hover:bg-blue-100/80',
      iconColor: 'text-blue-700',
    },
    {
      role: 'Administrator Sekolah',
      name: 'Dra. Endang Purwanti',
      email: 'admin@eliteclassroom.com',
      nis: 'Koordinator Lomba',
      badge: '🛡️ Admin Verifikasi & Prestasi',
      bg: 'border-purple-200 bg-purple-50/60 hover:bg-purple-100/80',
      iconColor: 'text-purple-700',
    },
    {
      role: 'Web Developer / Architect',
      name: 'Developer Elite Core',
      email: 'dev@eliteclassroom.com',
      nis: 'System Health',
      badge: '💻 Developer Telemetry & DB',
      bg: 'border-amber-200 bg-amber-50/60 hover:bg-amber-100/80',
      iconColor: 'text-amber-700',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F5] via-[#F8FAFC] to-[#FFE4E6] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        {/* Logo */}
        <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-[#991B1B] via-[#8B0000] to-[#F43F5E] items-center justify-center text-white shadow-xl shadow-rose-950/20 mb-1">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          ELITE CLASSROOM
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-sm mx-auto">
          Masuk ke akun Pelajar atau Guru untuk mengakses ruang belajar mandiri, bimbingan lomba, dan klaim XP.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-xl shadow-rose-950/5 rounded-3xl border border-rose-100 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Email Akun</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="dhafin@eliteclassroom.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Kata Sandi</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary-crimson text-xs py-3 shadow-md"
            >
              <span>{loading ? 'Memeriksa Akun...' : 'Masuk ke Platform'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login Cards */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Pilih Akun Demo (1-Klik Masuk)
              </span>
              <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                Instan
              </span>
            </div>

            <div className="space-y-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleQuickLogin(acc.email)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between group ${acc.bg}`}
                >
                  <div className="truncate mr-2">
                    <p className="font-bold text-slate-800 leading-snug truncate">
                      {acc.name}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono truncate">
                      {acc.email}
                    </p>
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-1 rounded-lg bg-white/90 shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                    {acc.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
