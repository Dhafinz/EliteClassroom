import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Elite Classroom database (SQLite)...');

  // Clear existing data in correct order
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

  // 1. Create Users
  const student1 = await prisma.user.create({
    data: {
      name: 'Ahmad Rizky Pratama',
      email: 'rizky@elite.sch.id',
      password: 'password123',
      role: 'student',
      nisNip: '2024101',
      className: 'XII RPL 1',
      xp: 380, // Level 4
      waNumber: '081234567890',
    },
  });

  const student2 = await prisma.user.create({
    data: {
      name: 'Siti Fatimah Azzahra',
      email: 'siti@elite.sch.id',
      password: 'password123',
      role: 'student',
      nisNip: '2024102',
      className: 'XI TKJ 2',
      xp: 195, // Level 3
      waNumber: '081234567891',
    },
  });

  const student3 = await prisma.user.create({
    data: {
      name: 'Dimas Arya Saputra',
      email: 'dimas@elite.sch.id',
      password: 'password123',
      role: 'student',
      nisNip: '2024103',
      className: 'X PPLG 1',
      xp: 85, // Level 2
      waNumber: '081234567892',
    },
  });

  const teacher1 = await prisma.user.create({
    data: {
      name: 'Budi Santoso, M.Kom',
      email: 'budi@elite.sch.id',
      password: 'password123',
      role: 'teacher',
      nisNip: '198503122010011005',
      department: 'Rekayasa Perangkat Lunak & Web',
      waNumber: '081298765432',
    },
  });

  const teacher2 = await prisma.user.create({
    data: {
      name: 'Dewi Lestari, S.Pd, M.Ds',
      email: 'dewi@elite.sch.id',
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
      email: 'admin@elite.sch.id',
      password: 'password123',
      role: 'admin',
      nisNip: '197608151999032001',
      department: 'Koordinator Prestasi & Kurikulum',
    },
  });

  const developer = await prisma.user.create({
    data: {
      name: 'Developer Elite Core',
      email: 'dev@elite.sch.id',
      password: 'password123',
      role: 'developer',
      department: 'System Architecture',
    },
  });

  // 2. Learning Materials
  const mat1 = await prisma.learningMaterial.create({
    data: {
      teacherId: teacher1.id,
      title: 'Kuasai Next.js 15 App Router & Server Actions untuk Web Lomba',
      description:
        'Panduan komprehensif memahami arsitektur Next.js 15, React Server Components, dan integrasi backend database SQLite/Prisma untuk membuat proyek kompetisi tingkat nasional yang cepat dan scalable.',
      type: 'youtube',
      youtubeUrl: 'https://www.youtube.com/watch?v=wm5g4U430Qw',
      youtubeId: 'wm5g4U430Qw',
      thumbnail: 'https://img.youtube.com/vi/wm5g4U430Qw/hqdefault.jpg',
      category: 'Teknologi',
      xpReward: 3,
    },
  });

  const mat2 = await prisma.learningMaterial.create({
    data: {
      teacherId: teacher1.id,
      title: 'Strategi Problem Solving & Algoritma Efisien Olimpiade Informatika',
      description:
        'Latihan bedah soal algoritma struktur data, kompleksitas waktu Big-O, graf, dynamic programming, dan optimasi query untuk persiapan kompetisi olimpiade sains.',
      type: 'youtube',
      youtubeUrl: 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
      youtubeId: 'kqtD5dpn9C8',
      thumbnail: 'https://img.youtube.com/vi/kqtD5dpn9C8/hqdefault.jpg',
      category: 'Sains & Logika',
      xpReward: 3,
    },
  });

  const mat3 = await prisma.learningMaterial.create({
    data: {
      teacherId: teacher2.id,
      title: 'Mastering UI/UX Design System: Wireframe Menuju High-Fidelity',
      description:
        'Bedah teknik menyusun visual hierarchy yang memukau dewan juri, pemilihan tipografi, kontras warna aksesibilitas, dan prototipe interaktif modern.',
      type: 'youtube',
      youtubeUrl: 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU',
      youtubeId: 'c9Wg6Cb_YlU',
      thumbnail: 'https://img.youtube.com/vi/c9Wg6Cb_YlU/hqdefault.jpg',
      category: 'Desain',
      xpReward: 3,
    },
  });

  const mat4 = await prisma.learningMaterial.create({
    data: {
      teacherId: teacher2.id,
      title: 'Rahasia Presentasi & Pitching Karya Juara di Hadapan Juri',
      description:
        'Bagaimana menyampaikan nilai jual inovasi karya web Anda dalam waktu 5 menit, menjawab pertanyaan teknis juri dengan percaya diri, dan memukau audiens.',
      type: 'youtube',
      youtubeUrl: 'https://www.youtube.com/watch?v=8hly31xKli0',
      youtubeId: '8hly31xKli0',
      thumbnail: 'https://img.youtube.com/vi/8hly31xKli0/hqdefault.jpg',
      category: 'Umum',
      xpReward: 3,
    },
  });

  const mat5 = await prisma.learningMaterial.create({
    data: {
      teacherId: teacher1.id,
      title: 'E-Modul: Standar Arsitektur API RESTful & Keamanan Data Web',
      description:
        'Dokumen e-modul resmi pegangan kontingen lomba: panduan implementasi JWT, sanitasi input, transaksi basis data ACID, dan penanganan session aman.',
      type: 'pdf',
      fileUrl: '/docs/panduan-arsitektur-web.pdf',
      category: 'Teknologi',
      xpReward: 3,
    },
  });

  // Mark student 1 completed material 1
  await prisma.materialProgress.create({
    data: {
      studentId: student1.id,
      materialId: mat1.id,
      isCompleted: true,
      xpEarned: 3,
      completedAt: new Date(),
    },
  });

  // 3. Quizzes
  const quiz1 = await prisma.quiz.create({
    data: {
      teacherId: teacher1.id,
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
        question: 'Komponen apakah yang secara default di-render di sisi server pada App Router Next.js 15?',
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

  // 4. Competitions
  const comp1 = await prisma.competition.create({
    data: {
      categoryId: 1,
      fieldId: 1,
      categoryName: 'Teknologi & IT',
      createdBy: teacher1.id,
      title: 'National Web Design & App Innovation Championship 2026',
      organizer: 'Kementerian Pendidikan & Asosiasi IT Nasional',
      level: 'Nasional',
      type: 'team',
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
      createdBy: teacher2.id,
      title: 'Creative UI/UX Hackathon & Design Sprint Pelajar 2026',
      organizer: 'Indonesian Digital Design Guild (IDDG)',
      level: 'Nasional',
      type: 'team',
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
      createdBy: teacher1.id,
      title: 'Olimpiade Sains & Informatika Siswa Tingkat Provinsi',
      organizer: 'Dinas Pendidikan & Ikatan Alumni Sains',
      level: 'Provinsi',
      type: 'solo',
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

  // Crowdsourced Competition by Student Ahmad Rizky (Pending Moderation!)
  const compPending = await prisma.competition.create({
    data: {
      categoryId: 3,
      fieldId: 4,
      categoryName: 'Bisnis Digital & Startup',
      createdBy: student1.id, // Siswa pengusul
      title: 'Digital Youth Startup Pitch & Business Model Competition 2026',
      organizer: 'Himpunan Pengusaha Muda & Inkubator Kampus',
      level: 'Nasional',
      type: 'team',
      description:
        'Lomba ide bisnis rintisan teknologi digital untuk siswa SMA/SMK dengan hadiah modal usaha dan pendampingan inkubasi. Diusulkan oleh siswa dari informasi komunitas luar.',
      linkRegistration: 'https://startup-youth.id/apply',
      guidebookLink: 'https://startup-youth.id/panduan.pdf',
      poster: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80',
      deadline: new Date('2026-12-10T23:59:59Z'),
      verificationStatus: 'pending', // Menunggu moderasi admin/guru!
    },
  });

  // 5. Teams & Mentorship
  const team1 = await prisma.team.create({
    data: {
      competitionId: comp1.id,
      leaderId: student1.id,
      name: 'Elite Dev Squad',
      inviteCode: 'ELT-789',
    },
  });

  await prisma.teamMember.create({
    data: {
      teamId: team1.id,
      userId: student1.id,
      role: 'leader',
    },
  });

  await prisma.teamMember.create({
    data: {
      teamId: team1.id,
      userId: student2.id,
      role: 'member',
    },
  });

  // Mentorship
  await prisma.mentorship.create({
    data: {
      teacherId: teacher1.id,
      studentId: student1.id,
      field: 'Web Development & System Architecture',
      notes: 'Tim sudah menyelesaikan wireframe arsitektur Next.js. Fokus minggu ini: integrasi Prisma dan Server Actions.',
      status: 'active',
    },
  });

  console.log('Database successfully seeded with realistic demo data!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
