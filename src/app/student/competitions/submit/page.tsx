import AppShell from '@/components/AppShell';
import SubmitCompetitionClient from '@/components/SubmitCompetitionClient';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SubmitCompetitionPage() {
  return (
    <AppShell>
      <div className="space-y-4 max-w-3xl mx-auto">
        <Link
          href="/student/competitions"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#8B0000] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog Lomba</span>
        </Link>

        <SubmitCompetitionClient />
      </div>
    </AppShell>
  );
}
