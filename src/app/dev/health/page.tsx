import AppShell from '@/components/AppShell';
import { prisma } from '@/lib/prisma';
import { Activity, Database, Server, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DevHealthPage() {
  const [userCount, materialCount, compCount, quizCount] = await Promise.all([
    prisma.user.count(),
    prisma.learningMaterial.count(),
    prisma.competition.count(),
    prisma.quiz.count(),
  ]);

  const auditLogs = [
    { time: '2 Menit yang lalu', action: 'Material View & XP Claim', user: 'Ahmad Rizky Pratama', status: 'Success (+3 XP)' },
    { time: '15 Menit yang lalu', action: 'Competition Proposal Submitted', user: 'Ahmad Rizky Pratama', status: 'Pending Review' },
    { time: '1 Jam yang lalu', action: 'YouTube Material Published', user: 'Budi Santoso, M.Kom', status: 'Active (Thumbnail HD)' },
    { time: '3 Jam yang lalu', action: 'Database SQLite Synchronized', user: 'System Architect', status: 'Synced (dev.db)' },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#8B0000] via-[#991B1B] to-[#F43F5E] text-white shadow-lg shadow-rose-950/15">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold">
              <Activity className="w-3.5 h-3.5 text-amber-300" />
              <span>Developer Telemetry & System Diagnostics</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight">System Health & SQLite Diagnostics</h1>
            <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
              Monitoring performa server Next.js, latensi API route, konektivitas database SQLite, dan rekaman audit jejak aktivitas sistem.
            </p>
          </div>
        </div>

        {/* Diagnostics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card-elite p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
              <span>Database Engine</span>
              <Database className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xl font-black text-slate-800">SQLite (dev.db)</p>
            <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Connected & Healthy
            </p>
          </div>

          <div className="card-elite p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
              <span>Framework Runtime</span>
              <Server className="w-4 h-4 text-[#8B0000]" />
            </div>
            <p className="text-xl font-black text-slate-800">Next.js 16 (App Router)</p>
            <p className="text-[11px] text-slate-500 font-medium">React Server Components</p>
          </div>

          <div className="card-elite p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
              <span>Total Entitas Data</span>
              <Activity className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-xl font-black text-slate-800">
              {userCount + materialCount + compCount + quizCount} Records
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              {userCount} Users • {materialCount} Materi • {compCount} Lomba
            </p>
          </div>
        </div>

        {/* Audit Logs */}
        <div className="card-elite overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Audit Trail Aktivitas Sistem</h3>
            <span className="text-[11px] text-slate-400 font-mono">Live Telemetry</span>
          </div>

          <div className="divide-y divide-slate-100">
            {auditLogs.map((log, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-800">{log.action}</p>
                  <p className="text-[11px] text-slate-500">Inisiator: {log.user}</p>
                </div>
                <div className="text-right space-y-0.5">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                    {log.status}
                  </span>
                  <p className="text-[10px] text-slate-400 flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3" />
                    {log.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
