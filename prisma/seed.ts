import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Elite Classroom database (SQLite) with updated users, chat & documents...');

  // Clear existing data in correct order
  await prisma.notification.deleteMany();
  await prisma.competitionMessage.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.materialProgress.deleteMany();
  await prisma.learningMaterial.deleteMany();
  await prisma.mentorship.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.participation.deleteMany();
  await prisma.competition.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Users with @eliteclassroom.com accounts
  const dhafin = await prisma.user.create({
    data: {
      name: 'Dhafin Kautsar',
      email: 'dhafin@eliteclassroom.com',
      password: 'password123',
      role: 'student',
      nisNip: '2024001',
      className: 'XII RPL 1',
      xp: 420, // Level 4
      waNumber: '081234567899',
    },
  });

  const rizky = await prisma.user.create({
    data: {
      name: 'Ahmad Rizky Pratama',
      email: 'rizky@eliteclassroom.com',
      password: 'password123',
      role: 'student',
      nisNip: '2024101',
      className: 'XII RPL 1',
      xp: 380, // Level 4
      waNumber: '081234567890',
    },
  });

  const siti = await prisma.user.create({
    data: {
      name: 'Siti Fatimah Azzahra',
      email: 'siti@eliteclassroom.com',
      password: 'password123',
      role: 'student',
      nisNip: '2024102',
      className: 'XI TKJ 2',
      xp: 195, // Level 3
      waNumber: '081234567891',
    },
  });

  const teacherBudi = await prisma.user.create({
    data: {
      name: 'Budi Santoso, M.Kom',
      email: 'budi@eliteclassroom.com',
      password: 'password123',
      role: 'teacher',
      nisNip: '198503122010011005',
      department: 'Rekayasa Perangkat Lunak & Web',
      waNumber: '081298765432',
    },
  });

  const teacherDewi = await prisma.user.create({
    data: {
      name: 'Dewi Lestari, S.Pd, M.Ds',
      email: 'dewi@eliteclassroom.com',
      password: 'password123',
      role: 'teacher',
      nisNip: '198904252014022003',
      department: 'Desain Komunikasi Visual & UI/UX',
      waNumber: '081298765433',
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: 'Dra. Endang Purwanti (Admin)',
      email: 'admin@eliteclassroom.com',
      password: 'password123',
      role: 'admin',
      nisNip: '197608151999032001',
      department: 'Koordinator Prestasi & Kurikulum',
    },
  });

  const developer = await prisma.user.create({
    data: {
      name: 'Developer Elite Core',
      email: 'dev@eliteclassroom.com',
      password: 'password123',
      role: 'developer',
      department: 'System Architecture',
    },
  });

  // 2. Learning Materials (YouTube Videos + Word / PDF Documents)
  const mat1 = await prisma.learningMaterial.create({
    data: {
      teacherId: teacherBudi.id,
      title: 'Kuasai Next.js 15 App Router & Server Actions untuk Web Lomba',
      description:
        'Panduan komprehensif memahami arsitektur Next.js 15, React Server Components, dan integrasi backend database SQLite/Prisma untuk membuat proyek kompetisi tingkat nasional yang cepat dan scalable.',
      type: 'youtube',
      fileFormat: 'video',
      youtubeUrl: 'https://www.youtube.com/watch?v=wm5g4U430Qw',
      youtubeId: 'wm5g4U430Qw',
      thumbnail: 'https://img.youtube.com/vi/wm5g4U430Qw/hqdefault.jpg',
      category: 'Teknologi',
      xpReward: 3,
    },
  });

  const mat2 = await prisma.learningMaterial.create({
    data: {
      teacherId: teacherBudi.id,
      title: 'Strategi Problem Solving & Algoritma Efisien Olimpiade Informatika',
      description:
        'Latihan bedah soal algoritma struktur data, kompleksitas waktu Big-O, graf, dynamic programming, dan optimasi query untuk persiapan kompetisi olimpiade sains.',
      type: 'youtube',
      fileFormat: 'video',
      youtubeUrl: 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
      youtubeId: 'kqtD5dpn9C8',
      thumbnail: 'https://img.youtube.com/vi/kqtD5dpn9C8/hqdefault.jpg',
      category: 'Sains & Logika',
      xpReward: 3,
    },
  });

  const mat3 = await prisma.learningMaterial.create({
    data: {
      teacherId: teacherDewi.id,
      title: 'Mastering UI/UX Design System: Wireframe Menuju High-Fidelity',
      description:
        'Bedah teknik menyusun visual hierarchy yang memukau dewan juri, pemilihan tipografi, kontras warna aksesibilitas, dan prototipe interaktif modern.',
      type: 'youtube',
      fileFormat: 'video',
      youtubeUrl: 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU',
      youtubeId: 'c9Wg6Cb_YlU',
      thumbnail: 'https://img.youtube.com/vi/c9Wg6Cb_YlU/hqdefault.jpg',
      category: 'Desain',
      xpReward: 3,
    },
  });

  // Dokumen Materi Word
  const matDocWord = await prisma.learningMaterial.create({
    data: {
      teacherId: teacherBudi.id,
      title: 'Dokumen Word: Template & Panduan Penulisan Proposal Lomba IT',
      description:
        'Dokumen panduan resmi menyusun proposal inovasi teknologi, bab latar belakang masalah, perancangan solusi teknis, dan rancangan anggaran biaya (RAB).',
      type: 'word',
      fileFormat: 'word',
      category: 'Teknologi',
      xpReward: 3,
      content: `# PANDUAN PENYUSUNAN PROPOSAL LOMBA IT & INOVASI TEKNOLOGI
Disusun oleh: Tim Pembimbing Prestasi Sekolah (Budi Santoso, M.Kom)

## 1. STRUKTUR PROPOSAL JUARA
1. **Executive Summary (Ringkasan Eksekutif)**:
   - Jelaskan dalam 1 paragraf: masalah apa yang diselesaikan, siapa penerima manfaat, dan apa teknologi kuncinya.
2. **Problem Statement (Latar Belakang & Urgensi)**:
   - Gunakan data riil atau studi kasus di masyarakat / industri.
   - Hindari asumsi kosong; sertakan kutipan data terpercaya.
3. **Solusi Teknologi**:
   - Jelaskan arsitektur sistem (Front-end, Back-end, Database, Integrasi AI / Cloud).
   - Lampirkan diagram alur sistem (System Architecture Diagram).
4. **Keunggulan & Diferensiasi**:
   - Apa yang membedakan karyamu dari aplikasi yang sudah ada di Play Store / Web?
5. **Timeline Pengembangan & Tim**:
   - Pembagian tugas jelas (Hacker/Developer, Hipster/UI Designer, Hustler/Project Lead).`,
    },
  });

  // Dokumen Materi PDF
  const matDocPdf = await prisma.learningMaterial.create({
    data: {
      teacherId: teacherDewi.id,
      title: 'E-Modul PDF: Panduan Teori Aksesibilitas Desain UI/UX (WCAG 2.1)',
      description:
        'Modul ringkasan standar kontras warna, ukuran font minimum, navigasi keyboard, dan hierarki visual yang menjadi tolok ukur penilaian dewan juri.',
      type: 'pdf',
      fileFormat: 'pdf',
      category: 'Desain',
      xpReward: 3,
      content: `# STANDAR AKSESIBILITAS & ESTETIKA UI/UX LOMBA DESAIN
Disusun oleh: Dewi Lestari, S.Pd, M.Ds

## A. Rasio Kontras Warna
- **Teks Utama**: Wajib memenuhi rasio kontras minimal 4.5:1 terhadap background.
- **Teks Judul Besar (>= 18pt)**: Rasio kontras minimal 3:1.
- **Warna Aksen**: Jangan hanya mengandalkan warna untuk memberi status; sertakan ikon pendukung.

## B. Visual Hierarchy
- Judul Halaman (H1): 24px - 32px (Bold)
- Subjudul (H2): 18px - 20px (Semi-Bold)
- Body Text: 14px - 16px (Regular, Line-height 1.5)`,
    },
  });

  // Mark student Dhafin completed material 1
  await prisma.materialProgress.create({
    data: {
      studentId: dhafin.id,
      materialId: mat1.id,
      isCompleted: true,
      xpEarned: 3,
      completedAt: new Date(),
    },
  });

  // 3. Quizzes
  const quiz1 = await prisma.quiz.create({
    data: {
      teacherId: teacherBudi.id,
      title: 'Tantangan Cepat: Fondasi Next.js 15 & Clean Architecture',
      description: 'Uji pemahaman teknis seputar App Router, Server Components, dan performa web modern.',
      category: 'Teknologi',
      timeLimit: 15,
      xpReward: 10,
    },
  });

  await prisma.quizQuestion.createMany({
    data: [
      {
        quizId: quiz1.id,
        question: 'Komponen apakah yang secara default di-render di sisi server pada App Router Next.js?',
        optionA: 'Client Component (menggunakan "use client")',
        optionB: 'React Server Component (RSC)',
        optionC: 'Pure Javascript DOM Node',
        optionD: 'Webpack Static Module',
        correctKey: 'B',
        explanation: 'Pada Next.js App Router, seluruh komponen di dalam folder app secara default adalah React Server Component (RSC) kecuali secara eksplisit diawali direktif "use client".',
      },
      {
        quizId: quiz1.id,
        question: 'Metode apakah yang direkomendasikan untuk melakukan mutasi data langsung dari form tanpa API endpoint terpisah?',
        optionA: 'Next.js Server Actions',
        optionB: 'WebSockets Event',
        optionC: 'XHR Request Sync',
        optionD: 'LocalStorage Sync',
        correctKey: 'A',
        explanation: 'Server Actions memungkinkan pemanggilan fungsi server asinkron langsung dari form HTML atau event handler komponen.',
      },
      {
        quizId: quiz1.id,
        question: 'Bagaimana cara mencegah race condition dan klaim ganda pada transaksi penambahan XP di Prisma ORM?',
        optionA: 'Menggunakan prisma.$transaction',
        optionB: 'Membuat loop setTimeout',
        optionC: 'Menyimpan nilai di window.localStorage',
        optionD: 'Mengabaikan validasi unik',
        correctKey: 'A',
        explanation: 'prisma.$transaction menjamin eksekusi atomik (ACID) sehingga data XP dan progres belajar diperbarui secara konsisten tanpa duplikasi.',
      },
    ],
  });

  // 4. Competitions with Team Requirements
  const comp1 = await prisma.competition.create({
    data: {
      categoryId: 1,
      fieldId: 1,
      categoryName: 'Teknologi & IT',
      createdBy: teacherBudi.id,
      title: 'National Web Design & App Innovation Championship 2026',
      organizer: 'Kementerian Pendidikan & Asosiasi IT Nasional',
      level: 'Nasional',
      type: 'team',
      teamRequirement: '3 Orang (1 Frontend Dev, 1 Backend Dev, 1 UI/UX Designer)',
      description:
        'Kompetisi pengembangan aplikasi web tingkat nasional yang menantang pelajar SMK/SMA menghadirkan solusi digital inovatif berorientasi dampak sosial, performa tinggi, dan estetika premium.',
      linkRegistration: 'https://kompetisi-web.id/register',
      guidebookLink: 'https://kompetisi-web.id/buku-panduan-2026.pdf',
      poster: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      deadline: new Date('2026-11-20T23:59:59Z'),
      verificationStatus: 'approved',
      approvedBy: admin.id,
    },
  });

  const comp2 = await prisma.competition.create({
    data: {
      categoryId: 2,
      fieldId: 2,
      categoryName: 'Desain Grafis & UI/UX',
      createdBy: teacherDewi.id,
      title: 'Creative UI/UX Hackathon & Design Sprint Pelajar 2026',
      organizer: 'Indonesian Digital Design Guild (IDDG)',
      level: 'Nasional',
      type: 'team',
      teamRequirement: '2-3 Orang (UI Designer & User Researcher)',
      description:
        'Ajang adu kepekaan rasa estetika, riset kebutuhan pengguna (user research), dan keandalan sistem interaksi desain antarmuka digital untuk pelajar kreatif se-Indonesia.',
      linkRegistration: 'https://iddg.org/hackathon',
      guidebookLink: 'https://iddg.org/guide.pdf',
      poster: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80',
      deadline: new Date('2026-11-15T23:59:59Z'),
      verificationStatus: 'approved',
      approvedBy: admin.id,
    },
  });

  const comp3 = await prisma.competition.create({
    data: {
      categoryId: 1,
      fieldId: 3,
      categoryName: 'Sains & Algoritma',
      createdBy: teacherBudi.id,
      title: 'Olimpiade Sains & Informatika Siswa Tingkat Provinsi',
      organizer: 'Dinas Pendidikan & Ikatan Alumni Sains',
      level: 'Provinsi',
      type: 'solo',
      teamRequirement: '1 Peserta Individu (Siswa Jurusan IT / IPA)',
      description:
        'Seleksi kompetisi sains komputer bidang logika algoritma, matematika diskrit, dan pemrograman kompetitif untuk menjaring bibit unggul perwakilan provinsi.',
      linkRegistration: 'https://disdik.go.id/olimpiade-it',
      guidebookLink: 'https://disdik.go.id/juknis-2026.pdf',
      poster: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
      deadline: new Date('2026-10-30T23:59:59Z'),
      verificationStatus: 'approved',
      approvedBy: admin.id,
    },
  });

  // Crowdsourced Competition (Pending)
  const compPending = await prisma.competition.create({
    data: {
      categoryId: 3,
      fieldId: 4,
      categoryName: 'Bisnis Digital & Startup',
      createdBy: dhafin.id,
      title: 'Digital Youth Startup Pitch & Business Model Competition 2026',
      organizer: 'Himpunan Pengusaha Muda & Inkubator Kampus',
      level: 'Nasional',
      type: 'team',
      teamRequirement: '3-4 Orang (Hustler, Hacker, Hipster)',
      description:
        'Lomba ide bisnis rintisan teknologi digital untuk siswa SMA/SMK dengan hadiah modal usaha dan pendampingan inkubasi. Diusulkan oleh siswa dari informasi komunitas luar.',
      linkRegistration: 'https://startup-youth.id/apply',
      guidebookLink: 'https://startup-youth.id/panduan.pdf',
      poster: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80',
      deadline: new Date('2026-12-10T23:59:59Z'),
      verificationStatus: 'pending',
    },
  });

  // 5. Teams & Chat Messages for Competition 1
  const team1 = await prisma.team.create({
    data: {
      competitionId: comp1.id,
      leaderId: dhafin.id,
      name: 'Alpha Cyber Dev',
      inviteCode: 'ELT-89X',
    },
  });

  await prisma.teamMember.create({
    data: {
      teamId: team1.id,
      userId: dhafin.id,
      role: 'leader',
    },
  });

  await prisma.teamMember.create({
    data: {
      teamId: team1.id,
      userId: rizky.id,
      role: 'member',
    },
  });

  // Chat messages for Competition 1 (Chat Pencarian Tim)
  await prisma.competitionMessage.createMany({
    data: [
      {
        competitionId: comp1.id,
        userId: dhafin.id,
        message: 'Halo teman-teman! Tim kami (Alpha Cyber Dev) saat ini butuh 1 anggota lagi untuk fokus di bagian UI/UX Designer & presentasi. Ada yang berminat?',
        createdAt: new Date(Date.now() - 3600000 * 3),
      },
      {
        competitionId: comp1.id,
        userId: siti.id,
        message: 'Halo Kak Dhafin! Saya bisa bantu untuk pembuatan desain di Figma dan riset kebutuhan pengguna. Boleh minta kode undangannya?',
        createdAt: new Date(Date.now() - 3600000 * 2),
      },
      {
        competitionId: comp1.id,
        userId: dhafin.id,
        message: 'Boleh banget Siti! Kode undangannya: ELT-89X. Silakan gabung ya!',
        createdAt: new Date(Date.now() - 3600000 * 1),
      },
    ],
  });

  // 6. Mentorship
  await prisma.mentorship.create({
    data: {
      teacherId: teacherBudi.id,
      studentId: dhafin.id,
      field: 'Web Development & System Architecture',
      notes: 'Tim sudah menyelesaikan konsep awal Next.js. Minggu ini fokus pada integrasi form dan autentikasi.',
      status: 'active',
    },
  });

  // 7. Notifications for Student Dhafin
  await prisma.notification.createMany({
    data: [
      {
        userId: dhafin.id,
        title: '✨ Klaim XP Berhasil!',
        message: 'Selamat! Anda memperoleh +3 XP dari materi "Kuasai Next.js 15 App Router".',
        type: 'xp',
        link: '/student/learn',
      },
      {
        userId: dhafin.id,
        title: '🤝 Permohonan Bimbingan Diterima!',
        message: 'Bapak Budi Santoso, M.Kom telah menerima permohonan bimbingan lomba Anda.',
        type: 'mentorship',
        link: '/student/my-competitions',
      },
      {
        userId: dhafin.id,
        title: '💬 Pesan Baru di Chat Lomba',
        message: 'Siti Fatimah membalas chat di forum lomba National Web Design 2026.',
        type: 'chat',
        link: `/student/competitions/${comp1.id}`,
      },
      {
        userId: dhafin.id,
        title: '📋 Usulan Lomba Diproses',
        message: 'Usulan lomba "Digital Youth Startup 2026" sedang menunggu kurasi admin.',
        type: 'competition',
        link: '/',
      },
    ],
  });

  console.log('Database successfully re-seeded with realistic data & accounts!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
