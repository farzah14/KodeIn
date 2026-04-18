"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Locale = "en" | "id";

type TranslationKey = 
  | "topbar.map"
  | "topbar.practice"
  | "topbar.leaderboard"
  | "topbar.battle"
  | "topbar.level"
  | "topbar.streak"
  | "topbar.switcher"
  | "topbar.login"
  | "topbar.logout"
  | "hero.badge"
  | "hero.title"
  | "hero.interactive"
  | "hero.subtitle"
  | "hero.cta"
  | "hero.map"
  | "features.instant.title"
  | "features.instant.desc"
  | "features.bite.title"
  | "features.bite.desc"
  | "features.habit.title"
  | "features.habit.desc"
  | "cta.ready"
  | "cta.join"
  | "cta.start"
  | "leaderboard.title"
  | "leaderboard.subtitle"
  | "leaderboard.ranking"
  | "leaderboard.refresh"
  | "leaderboard.totalUsers"
  | "leaderboard.experience"
  | "leaderboard.master"
  | "leaderboard.progress"
  | "leaderboard.points"
  | "leaderboard.you"
  | "leaderboard.empty"
  | "leaderboard.loading"
  | "leaderboard.tabs.xp"
  | "leaderboard.tabs.practice"
  | "leaderboard.stats.solved"
  | "leaderboard.stats.elite"
  | "practice.sandbox"
  | "practice.title"
  | "practice.hero.title"
  | "practice.hero.badge"
  | "practice.hero.desc"
  | "practice.stats.total"
  | "practice.stats.completed"
  | "practice.search"
  | "practice.empty"
  | "practice.emptyDesc"
  | "practice.done"
  | "practice.subtitle"
  | "practice.run"
  | "practice.running"
  | "practice.reset"
  | "practice.waiting"
  | "practice.cases.example"
  | "practice.cases.results"
  | "practice.cases.case"
  | "practice.complete.title"
  | "practice.complete.desc"
  | "lesson.current"
  | "lesson.mastery"
  | "lesson.step"
  | "lesson.continue"
  | "lesson.finish"
  | "lesson.next"
  | "lesson.completedTitle"
  | "lesson.masteryComplete"
  | "lesson.finishCourse"
  | "lesson.notFound"
  | "lesson.noSteps"
  | "lesson.cleared"
  | "learn.quest"
  | "learn.stepsCompleted"
  | "learn.totalProgress"
  | "battle.lobbyTitle"
  | "profile.avatar.styles"
  | "profile.avatar.remove"
  | "profile.practice.dashboard"
  | "profile.stats.xp"
  | "profile.stats.streak"
  | "profile.stats.bestStreak"
  | "profile.stats.practice"
  | "profile.stats.avg"
  | "profile.stats.mastery"
  | "profile.stats.solvedDesc"
  | "profile.details.title"
  | "profile.details.updatePhoto"
  | "profile.details.name"
  | "profile.details.location"
  | "profile.details.save"
  | "profile.details.saving"
  | "profile.session.title"
  | "profile.session.desc"
  | "profile.session.logout"
  | "battle.title"
  | "battle.hero.title"
  | "battle.subtitle"
  | "battle.arena"
  | "battle.versus"
  | "battle.lobby.create"
  | "battle.lobby.join"
  | "battle.lobby.placeholder"
  | "battle.lobby.desc"
  | "battle.lobby.joinDesc"
  | "battle.lobby.back"
  | "battle.status.connecting"
  | "battle.status.waiting"
  | "battle.status.started"
  | "battle.status.coding"
  | "battle.status.empty"
  | "battle.submit"
  | "battle.submitted"
  | "battle.winner"
  | "battle.loser"
  | "battle.playAgain"
  | "common.back"
  | "common.loading"
  | "common.error";

const translations: Record<Locale, Record<string, string>> = {
  en: {
    "topbar.map": "Map",
    "topbar.practice": "Practice",
    "topbar.leaderboard": "Leaderboard",
    "topbar.battle": "1v1 Battle",
    "topbar.level": "Level",
    "topbar.streak": "Streak",
    "topbar.switcher": "Language",
    "topbar.login": "Login",
    "topbar.logout": "Sign Out",
    "hero.badge": "Coding Masterclass 2024",
    "hero.title": "Level Up Your Character Through",
    "hero.interactive": "Interactive Learning",
    "hero.subtitle": "Master Python from zero to hero with gamified lessons, real-time code execution, and global competitions. Start your quest today.",
    "hero.cta": "Start Learning",
    "hero.map": "View Course Map",
    "features.instant.title": "Instant Feedback",
    "features.instant.desc": "Run code directly in your browser with our remote execution environments. Zero configuration needed.",
    "features.bite.title": "Bite-Sized Lessons",
    "features.bite.desc": "Short, actionable lessons designed to teach practical, real-world development skills effectively.",
    "features.habit.title": "Build the Habit",
    "features.habit.desc": "Maintain your daily streak and earn experience points to unlock exclusive developer badges.",
    "cta.ready": "Ready to Level Up?",
    "cta.join": "Join thousands of students learning to build the future, one line of code at a time.",
    "cta.start": "Start Coding Now",
    "leaderboard.title": "The Hall of Legends",
    "leaderboard.subtitle": "Celebrating the top students leveling up their code daily. Build your streak and climb the tower of glory.",
    "leaderboard.ranking": "Global Ranking",
    "leaderboard.refresh": "Refresh",
    "leaderboard.totalUsers": "Designers",
    "leaderboard.experience": "Experience Points",
    "leaderboard.master": "Master of Code",
    "leaderboard.progress": "XP Progress",
    "leaderboard.points": "Points",
    "leaderboard.you": "You",
    "leaderboard.empty": "No legends have risen yet.",
    "leaderboard.loading": "Loading legends...",
    "leaderboard.tabs.xp": "Learning XP",
    "leaderboard.tabs.practice": "Practice Solved",
    "leaderboard.stats.solved": "Solved",
    "leaderboard.stats.elite": "Elite Solver",
    "practice.sandbox": "Sandbox Environment",
    "practice.title": "KodeIn Playground",
    "practice.hero.title": "Sharpen Your Competitive Programming Skills.",
    "practice.hero.badge": "Level Up Your Logic",
    "practice.hero.desc": "Solve daily algorithm challenges to earn extra XP and climb the global leaderboards.",
    "practice.stats.total": "Total Challenges",
    "practice.stats.completed": "Completed",
    "practice.search": "Search challenges...",
    "practice.empty": "No challenges found",
    "practice.emptyDesc": "Try changing your filters or search term.",
    "practice.done": "Done",
    "practice.subtitle": "A free space to experiment, design algorithms, and sharpen your logic every day.",
    "practice.run": "Run Test Cases",
    "practice.running": "Running...",
    "practice.reset": "Reset",
    "practice.waiting": "Awaiting execution...",
    "practice.cases.example": "Example Test Cases",
    "practice.cases.results": "Test Case Results",
    "practice.cases.case": "Case",
    "practice.complete.title": "CHALLENGE COMPLETE!",
    "practice.complete.desc": "You have successfully solved this challenge.",
    "lesson.current": "Current Lesson",
    "lesson.mastery": "Mastery Progress",
    "lesson.step": "Step",
    "lesson.continue": "Continue Mission",
    "lesson.finish": "Finish Lesson",
    "lesson.next": "Next Lesson",
    "lesson.completedTitle": "Mastery Achieved",
    "lesson.masteryComplete": "You've successfully mastered this lesson.",
    "lesson.finishCourse": "Finish Course",
    "lesson.notFound": "Lesson not found",
    "lesson.noSteps": "This lesson does not have any steps yet.",
    "lesson.cleared": "Lesson Cleared",
    "learn.quest": "Current Quest",
    "learn.stepsCompleted": "steps completed",
    "learn.totalProgress": "Total Progress",
    "battle.lobbyTitle": "Battle Lobby",
    "profile.avatar.styles": "Avatar Styles",
    "profile.avatar.remove": "Remove custom",
    "profile.practice.dashboard": "Practice Dashboard",
    "profile.stats.xp": "Total Experience",
    "profile.stats.streak": "Current Streak",
    "profile.stats.bestStreak": "Best Streak",
    "profile.stats.practice": "Total Solved",
    "profile.stats.avg": "Daily Mastery",
    "profile.stats.mastery": "Mastery",
    "profile.stats.solvedDesc": "You have solved {solved} out of {total} challenges",
    "profile.details.title": "Profile Settings",
    "profile.details.updatePhoto": "Update Photo",
    "profile.details.name": "Display Name",
    "profile.details.location": "Location",
    "profile.details.save": "Save Changes",
    "profile.details.saving": "Saving Details...",
    "profile.session.title": "Account Session",
    "profile.session.desc": "Your progress will wait for you.",
    "profile.session.logout": "Log Out",
    "battle.title": "Battle Arena",
    "battle.hero.title": "Defeat Opponents by Thinking Logically",
    "battle.subtitle": "Prove your skills in real-time battles. Who is faster and more accurate?",
    "battle.arena": "1v1 Battle Arena",
    "battle.versus": "VERSUS",
    "battle.lobby.create": "Create Room",
    "battle.lobby.join": "Join Arena",
    "battle.lobby.placeholder": "Enter Room ID...",
    "battle.lobby.desc": "Create a new room and share its ID with your friend.",
    "battle.lobby.joinDesc": "Have a Room ID from a friend? Enter it below.",
    "battle.lobby.back": "Back to Lobby",
    "battle.status.connecting": "Connecting Battle...",
    "battle.status.waiting": "Waiting for opponent...",
    "battle.status.started": "Battle Started!",
    "battle.status.coding": "Coding...",
    "battle.status.empty": "Waiting for match...",
    "battle.submit": "Submit Code",
    "battle.submitted": "Submitted",
    "battle.winner": "YOU TRIUMPHED!",
    "battle.loser": "BATTLE ENDED",
    "battle.playAgain": "Play Again",
    "common.back": "Back to List",
    "common.loading": "Loading...",
    "common.error": "Connection error.",
  },
  id: {
    "topbar.map": "Peta",
    "topbar.practice": "Latihan",
    "topbar.leaderboard": "Papan Peringkat",
    "topbar.battle": "Duel 1v1",
    "topbar.level": "Level",
    "topbar.streak": "Streak",
    "topbar.switcher": "Bahasa",
    "topbar.login": "Masuk",
    "topbar.logout": "Keluar",
    "hero.badge": "Coding Masterclass 2024",
    "hero.title": "Tingkatkan Karaktermu Melalui",
    "hero.interactive": "Belajar Interaktif",
    "hero.subtitle": "Kuasai Python dari nol menjadi pahlawan dengan pelajaran gamifikasi, eksekusi kode real-time, dan kompetisi global. Mulai petualanganmu hari ini.",
    "hero.cta": "Mulai Belajar",
    "hero.map": "Lihat Peta Kursus",
    "features.instant.title": "Umpan Balik Instan",
    "features.instant.desc": "Jalankan kode langsung di browsermu dengan lingkungan eksekusi jarak jauh. Tanpa konfigurasi sama sekali.",
    "features.bite.title": "Materi Singkat",
    "features.bite.desc": "Pelajaran singkat dan praktis yang dirancang untuk mengajarkan keterampilan pengembangan dunia nyata secara efektif.",
    "features.habit.title": "Bangun Kebiasaan",
    "features.habit.desc": "Pertahankan streak harianmu dan raih poin pengalaman untuk membuka lencana pengembang eksklusif.",
    "cta.ready": "Siap Naik Level?",
    "cta.join": "Bergabunglah dengan ribuan siswa yang belajar membangun masa depan, satu baris kode dalam satu waktu.",
    "cta.start": "Mulai Coding Sekarang",
    "leaderboard.title": "Aula Para Legenda",
    "leaderboard.subtitle": "Apresiasi untuk para talenta terbaik yang mengasah logika mereka setiap hari. Jaga streak-mu dan daki puncak kejayaan!",
    "leaderboard.ranking": "Peringkat Global",
    "leaderboard.refresh": "Perbarui",
    "leaderboard.totalUsers": "Programmer",
    "leaderboard.experience": "Poin Pengalaman",
    "leaderboard.master": "Master KodeIn",
    "leaderboard.progress": "Progres XP",
    "leaderboard.points": "Poin",
    "leaderboard.you": "Kamu",
    "leaderboard.empty": "Belum ada legenda yang muncul.",
    "leaderboard.loading": "Menjemput para legenda...",
    "leaderboard.tabs.xp": "EXP Belajar",
    "leaderboard.tabs.practice": "Latihan Selesai",
    "leaderboard.stats.solved": "Selesai",
    "leaderboard.stats.elite": "Pemecah Elit",
    "practice.sandbox": "Lingkungan Sandbox",
    "practice.title": "KodeIn Playground",
    "practice.hero.title": "Asah Kemampuan Competitive Programming Kamu.",
    "practice.hero.badge": "Tingkatkan Logika Kamu",
    "practice.hero.desc": "Selesaikan tantangan algoritma harian untuk mendapatkan XP tambahan dan naiki peringkat di leaderboard global.",
    "practice.stats.total": "Total Soal",
    "practice.stats.completed": "Diselesaikan",
    "practice.search": "Cari tantangan...",
    "practice.empty": "Tidak ada tantangan ditemukan",
    "practice.emptyDesc": "Coba ubah filter atau pencarianmu.",
    "practice.done": "Selesai",
    "practice.subtitle": "Tempat bebas untuk bereksperimen, merancang algoritma, dan mengasah logika pemrogramanmu setiap hari.",
    "practice.run": "Jalankan Test Cases",
    "practice.running": "Berjalan...",
    "practice.reset": "Reset",
    "practice.waiting": "Menunggu eksekusi...",
    "practice.cases.example": "Contoh Test Cases",
    "practice.cases.results": "Hasil Test Cases",
    "practice.cases.case": "Kasus",
    "practice.complete.title": "TANTANGAN SELESAI!",
    "practice.complete.desc": "Anda berhasil menyelesaikan tantangan ini.",
    "lesson.current": "Pelajaran Saat Ini",
    "lesson.mastery": "Progres Penguasaan",
    "lesson.step": "Langkah",
    "lesson.continue": "Lanjutkan Misi",
    "lesson.finish": "Selesaikan Materi",
    "lesson.next": "Pelajaran Berikutnya",
    "lesson.completedTitle": "Penguasaan Tercapai",
    "lesson.masteryComplete": "Anda telah berhasil menguasai pelajaran ini.",
    "lesson.finishCourse": "Selesaikan Kursus",
    "lesson.notFound": "Pelajaran tidak ditemukan",
    "lesson.noSteps": "Pelajaran ini belum memiliki materi.",
    "lesson.cleared": "Pelajaran Selesai",
    "learn.quest": "Misi Saat Ini",
    "learn.stepsCompleted": "materi diselesaikan",
    "learn.totalProgress": "Total Progres",
    "battle.lobbyTitle": "Lobi Pertempuran",
    "profile.avatar.styles": "Gaya Avatar",
    "profile.avatar.remove": "Hapus kustom",
    "profile.practice.dashboard": "Dashboard Latihan",
    "profile.stats.xp": "Total Pengalaman",
    "profile.stats.streak": "Streak Saat Ini",
    "profile.stats.bestStreak": "Streak Terbaik",
    "profile.stats.practice": "Total Selesai",
    "profile.stats.avg": "Penguasaan Harian",
    "profile.stats.mastery": "Penguasaan",
    "profile.stats.solvedDesc": "Kamu telah menyelesaikan {solved} dari {total} tantangan",
    "profile.details.title": "Pengaturan Profil",
    "profile.details.updatePhoto": "Perbarui Foto",
    "profile.details.name": "Nama Tampilan",
    "profile.details.location": "Lokasi",
    "profile.details.save": "Simpan Perubahan",
    "profile.details.saving": "Menyimpan Detail...",
    "profile.session.title": "Sesi Akun",
    "profile.session.desc": "Progres Anda akan menunggumu.",
    "profile.session.logout": "Keluar Akun",
    "battle.title": "Battle Arena",
    "battle.hero.title": "Kalahkan Lawan Dengan Berpikir secara Logika",
    "battle.subtitle": "Buktikan kemampuan coding Anda dalam pertempuran real-time. Siapa yang lebih cepat dan akurat?",
    "battle.arena": "1v1 Battle Arena",
    "battle.versus": "PERTARUNGAN",
    "battle.lobby.create": "Buat Room",
    "battle.lobby.join": "Masuk Arena",
    "battle.lobby.placeholder": "Masukkan ID Room...",
    "battle.lobby.desc": "Buat room baru dan bagikan ID-nya kepada teman Anda.",
    "battle.lobby.joinDesc": "Punya ID Room dari teman? Masukkan di bawah ini.",
    "battle.lobby.back": "Kembali ke Lobby",
    "battle.status.connecting": "Menghubungkan Arena...",
    "battle.status.waiting": "Menunggu lawan...",
    "battle.status.started": "Pertempuran Dimulai!",
    "battle.status.coding": "Mengetik...",
    "battle.status.empty": "Menunggu Battle...",
    "battle.submit": "Kirim Kode",
    "battle.submitted": "Terkirim",
    "battle.winner": "KAMU MENANG!",
    "battle.loser": "PERTARUNGAN BERAKHIR",
    "battle.playAgain": "Main Lagi",
    "common.back": "Kembali ke Daftar",
    "common.loading": "Memuat...",
    "common.error": "Kesalahan koneksi.",
  }
};

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("kodeln_locale") as Locale;
    if (saved && (saved === "en" || saved === "id")) {
      setLocaleState(saved);
    }
    setMounted(true);
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("kodeln_locale", l);
  };

  const t = (key: TranslationKey): string => {
    return translations[locale][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      <div style={{ visibility: mounted ? "visible" : "hidden", display: "contents" }}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}

