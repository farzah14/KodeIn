"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Locale = "en" | "id";

type TranslationKey = 
  | "topbar.map"
  | "topbar.practice"
  | "topbar.leaderboard"
  | "topbar.login"
  | "topbar.signout"
  | "topbar.level"
  | "topbar.streak"
  | "topbar.switcher"
  | "hero.badge"
  | "hero.title"
  | "hero.subtitle"
  | "features.instant.title"
  | "features.instant.desc"
  | "features.bite.title"
  | "features.bite.desc"
  | "features.habit.title"
  | "features.habit.desc"
  | "cta.ready"
  | "cta.join"
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
  | "practice.sandbox"
  | "practice.title"
  | "practice.subtitle"
  | "practice.run"
  | "practice.reset"
  | "practice.waiting"
  | "lesson.current"
  | "lesson.mastery"
  | "lesson.step"
  | "lesson.continue"
  | "lesson.finish"
  | "lesson.next"
  | "lesson.completedTitle"
  | "lesson.masteryComplete"
  | "lesson.finishCourse";

const translations: Record<Locale, Record<string, string>> = {
  en: {
    "topbar.map": "Map",
    "topbar.practice": "Practice",
    "topbar.leaderboard": "Leaderboard",
    "topbar.login": "Get Started",
    "topbar.signout": "Sign Out",
    "topbar.level": "Level",
    "topbar.streak": "Streak",
    "topbar.switcher": "Language",
    "hero.badge": "+2k students",
    "hero.title": "Master Code Faster",
    "hero.subtitle": "Forget boring video tutorials. Write real code directly in your browser, earn XP, and climb the leaderboard as you build practical skills.",
    "features.instant.title": "Instant Execution",
    "features.instant.desc": "Run code directly in your browser with our remote execution environments. Zero configuration needed.",
    "features.bite.title": "Bite-Sized Lessons",
    "features.bite.desc": "Short, actionable lessons designed to teach practical, real-world development skills effectively.",
    "features.habit.title": "Build the Habit",
    "features.habit.desc": "Maintain your daily streak and earn experience points to unlock exclusive developer badges.",
    "cta.ready": "Ready to upskill?",
    "cta.join": "Join thousands of developers leveling up their careers on KodeIn. Always free to start.",
    "leaderboard.title": "The Hall of Legends",
    "leaderboard.subtitle": "Celebrating the top students leveling up their code daily. Build your streak and climb the tower of glory.",
    "leaderboard.ranking": "Global Ranking",
    "leaderboard.refresh": "Refresh",
    "leaderboard.totalUsers": "Total Users",
    "leaderboard.experience": "Experience Points",
    "leaderboard.master": "Master of Code",
    "leaderboard.progress": "XP Progress",
    "leaderboard.points": "XP Points",
    "leaderboard.you": "You",
    "leaderboard.empty": "Rankings will appear here once more users start learning.",
    "leaderboard.loading": "Loading legends...",
    "practice.sandbox": "Sandbox Environment",
    "practice.title": "KodeIn Playground",
    "practice.subtitle": "A free space to experiment, design algorithms, and sharpen your logic every day.",
    "practice.run": "RUN CODE",
    "practice.reset": "Reset",
    "practice.waiting": "Awaiting execution...",
    "lesson.current": "Current Lesson",
    "lesson.mastery": "Mastery Progress",
    "lesson.step": "Step",
    "lesson.continue": "Continue Mission",
    "lesson.finish": "Finish Lesson",
    "lesson.next": "Next Lesson",
    "lesson.completedTitle": "Lesson Completed",
    "lesson.masteryComplete": "Lesson mastery complete!",
    "lesson.finishCourse": "Finish Course",
  },
  id: {
    "topbar.map": "Peta",
    "topbar.practice": "Latihan",
    "topbar.leaderboard": "Peringkat",
    "topbar.login": "Mulai",
    "topbar.signout": "Keluar",
    "topbar.level": "Level",
    "topbar.streak": "Streak",
    "topbar.switcher": "Bahasa",
    "hero.badge": "+2k siswa",
    "hero.title": "Kuasai Kode Lebih Cepat",
    "hero.subtitle": "Lupakan tutorial video yang membosankan. Tulis kode nyata langsung di browsermu, raih XP, dan daki papan peringkat saat kamu membangun keterampilan praktis.",
    "features.instant.title": "Eksekusi Instan",
    "features.instant.desc": "Jalankan kode langsung di browsermu dengan lingkungan eksekusi jarak jauh. Tanpa konfigurasi sama sekali.",
    "features.bite.title": "Materi Singkat",
    "features.bite.desc": "Pelajaran singkat dan praktis yang dirancang untuk mengajarkan keterampilan pengembangan dunia nyata secara efektif.",
    "features.habit.title": "Bangun Kebiasaan",
    "features.habit.desc": "Pertahankan streak harianmu dan raih poin pengalaman untuk membuka lencana pengembang eksklusif.",
    "cta.ready": "Siap meningkatkan diri?",
    "cta.join": "Bergabunglah dengan ribuan pengembang yang meningkatkan karier mereka di KodeIn. Selalu gratis untuk memulai.",
    "leaderboard.title": "Aula Para Legenda",
    "leaderboard.subtitle": "Apresiasi untuk para talenta terbaik yang mengasah logika mereka setiap hari. Jaga streak-mu dan daki puncak kejayaan!",
    "leaderboard.ranking": "Peringkat Global",
    "leaderboard.refresh": "Perbarui",
    "leaderboard.totalUsers": "Total Pengguna",
    "leaderboard.experience": "Poin Pengalaman",
    "leaderboard.master": "Master KodeIn",
    "leaderboard.progress": "Progres XP",
    "leaderboard.points": "Poin XP",
    "leaderboard.you": "Kamu",
    "leaderboard.empty": "Peringkat akan muncul di sini setelah lebih banyak teman-teman mulai belajar.",
    "leaderboard.loading": "Menjemput para legenda...",
    "practice.sandbox": "Lingkungan Sandbox",
    "practice.title": "KodeIn Playground",
    "practice.subtitle": "Tempat bebas untuk bereksperimen, merancang algoritma, dan mengasah logika pemrogramanmu setiap hari.",
    "practice.run": "JALANKAN KODE",
    "practice.reset": "Reset",
    "practice.waiting": "Menunggu eksekusi...",
    "lesson.current": "Pelajaran Saat Ini",
    "lesson.mastery": "Progres Penguasaan",
    "lesson.step": "Langkah",
    "lesson.continue": "Lanjutkan Misi",
    "lesson.finish": "Selesaikan Materi",
    "lesson.next": "Materi Selanjutnya",
    "lesson.completedTitle": "Materi Selesai",
    "lesson.masteryComplete": "Materi telah dikuasai!",
    "lesson.finishCourse": "Selesaikan Kursus",
  }
};

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("kodeln_locale") as Locale;
      if (saved && (saved === "en" || saved === "id")) {
        return saved;
      }
    }
    return "en";
  });

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("kodeln_locale", l);
  };

  const t = (key: TranslationKey): string => {
    return translations[locale][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
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
