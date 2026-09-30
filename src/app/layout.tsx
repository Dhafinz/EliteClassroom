import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  title: 'Elite Classroom — Next-Gen Learning & Prestasi Hub',
  description:
    'Platform terpadu pembelajaran interaktif, bimbingan prestasi lomba guru, dan gamifikasi reward XP untuk Pelajar dan Guru.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}
