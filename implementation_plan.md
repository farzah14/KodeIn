# KodeIn — Implementation Plan: Level Up to Best Website

## 📌 Project Overview

**KodeIn** adalah platform belajar coding interaktif (mirip Duolingo for code) berbasis Next.js 16, Tailwind CSS v4, Prisma + SQLite/PostgreSQL, NextAuth v5.

**Stack saat ini:**

- Next.js 16 (App Router) + React 19
- Tailwind CSS v4
- Prisma + SQLite (dev) / PostgreSQL (prod)
- NextAuth v5 (Google + GitHub OAuth)
- Monaco Editor (code editor)
- Spline 3D (avatar)
- Lucide React (icons)

---

## 🔍 Analisis Kondisi Saat Ini (Current State)

### ✅ Yang Sudah Ada (Strengths)

| Area                                 | Status               |
| ------------------------------------ | -------------------- |
| Auth (Google + GitHub OAuth)         | ✅ Berjalan          |
| Progress tracking (XP + Streak)      | ✅ Berjalan          |
| Monaco Code Editor                   | ✅ Terintegrasi      |
| 3D Avatar (Spline) di Topbar         | ✅ Ada               |
| PathMap (Course Map zigzag)          | ✅ Berjalan          |
| Lesson Player (Explain + Code steps) | ✅ Berjalan          |
| Dark mode                            | ✅ Ada (class-based) |
| Mobile hamburger menu                | ✅ Ada               |

### ❌ Gap & Masalah Besar (Critical Gaps)

#### 1. **Landing Page Tidak Menarik** 🔴

- Halaman utama (`/`) hanya ada card kecil dengan teks "KodeIn" dan "Belajar Coding Gampang Kok😂"
- Tidak ada hero section yang impresif, tidak ada social proof, tidak ada feature showcase
- Sangat jauh dari standar website modern yang bisa *wow* pengguna

#### 2. **Code Runner Masih Mock** 🔴

- `mockPythonRunner.ts` hanya cek regex sederhana (`def` + `return`), tidak benar-benar menjalankan kode
- User bisa pass dengan kode yang salah secara logika
- Tanpa real execution engine, pengalaman belajar tidak valid

#### 3. **Konten Kursus Sangat Sedikit** 🔴

- Hanya 1 Unit aktif (Unit 1 — Basics) dengan 3 lesson
- Unit 2 dan Unit 3 masih "Coming Soon"
- Tidak cukup untuk menahan pengguna

#### 4. **Login Page Terlalu Sederhana** 🟡

- Tidak ada branding, tidak ada dark mode
- UI polos, tidak meyakinkan

#### 5. **Profile Page Minimal** 🟡

- Belum terlihat isinya, hanya redirect ke ProfileClient

#### 6. **Tidak Ada Sistem Gamifikasi yang Terlihat** 🟡

- XP dan Streak ada, tapi tidak ada Leaderboard, Badge, atau Level System yang nyata
- Progress bar terlalu sederhana

#### 7. **SEO & Meta Tags** 🟡

- Tidak ada metadata yang proper di halaman
- `layout.tsx` tidak memiliki `<title>` atau `<meta description>` yang kuat

#### 8. **Tidak Ada Practice / Playground Mode** 🟡

- Route `/practice` ada di folder tapi kosong

---

## 🎯 Tujuan Eksekusi Berikutnya

**Prioritas:** Buat KodeIn terasa seperti produk nyata yang premium, bukan MVP kasar.

---

## 🚀 Proposed Changes (Fase Eksekusi)

### FASE 1 — Landing Page Visual Overhaul [PALING PENTING]

> Ini adalah hal pertama yang user lihat. Kalau ini jelek, user langsung tutup.

#### [MODIFY] `src/app/page.tsx`

Redesign total menjadi full landing page dengan:

**Sections:**

1. **Hero Section** — Headline besar, animated gradient text, subheadline, 2 CTA buttons (Mulai Belajar + Lihat Demo), animated code snippet floating di samping
2. **Social Proof Bar** — "500+ Pelajar", "3 Bahasa", "100% Gratis" sebagai stat pills
3. **Feature Cards** — 3 cards: Interactive Coding, Track Progress, Real Feedback
4. **How It Works** — 3 langkah dengan ikon numbered
5. **CTA Footer Section** — Big CTA block sebelum footer

**Visual Style:**

- Background: dark gradient (`from-slate-950 via-indigo-950 to-slate-950`) dengan animated mesh
- Typography: Inter/Outfit dari Google Fonts
- Accent color: Indigo/Violet gradient
- Animated particles atau grid background
- Glassmorphism cards di feature section

---

### FASE 2 — Login Page Redesign

#### [MODIFY] `src/app/login/page.tsx`

- Full screen split layout (kiri: branding + quote, kanan: login form)
- Dark mode support
- Animated gradient background
- Social login buttons yang proper dengan icon Google dan GitHub SVG
- "Gratis selamanya" badge

---

### FASE 3 — Real Python Code Runner

#### [NEW] `src/lib/runner/pyodideRunner.ts`

Implementasi code runner menggunakan **Pyodide** (WebAssembly Python) atau **API-based execution**.

**Opsi A (Recommended): Pyodide (Client-side WASM)**

- Jalankan Python langsung di browser via WebAssembly
- Tidak perlu server, tidak ada biaya API
- Load Pyodide script di komponen CodeStep saja (lazy load)

**Opsi B: Piston API (Free, server-side)**

- HTTP POST ke `https://emkc.org/api/v2/piston/execute`
- Gratis, mendukung Python, JS, dan banyak bahasa lain
- Perlu internet connection

#### [MODIFY] `src/components/steps/CodeStep.tsx`

- Integrasikan real runner menggantikan mockPythonRunner
- Tambah output console yang real (stdout/stderr display)
- Loading skeleton saat kode dieksekusi
- Animasi test case pass/fail yang lebih menarik

---

### FASE 4 — Konten Kursus Diperluas

#### [MODIFY] `src/lib/content.ts`

Tambah minimal **5 lesson baru** untuk Unit 2 (Conditionals):

```
Unit 2 — Conditionals:
- L4: if/else basics
- L5: Comparison operators
- L6: Nested conditions
- L7: elif chain
- L8: Boolean logic (and/or/not)
```

---

### FASE 5 — Gamifikasi Visual

#### [NEW] `src/components/XPBar.tsx`

- Level system berdasarkan XP total (Level 1: 0-100 XP, Level 2: 100-250 XP, dst.)
- Visual XP bar dengan animasi fill saat naik level
- Level badge di profil

#### [MODIFY] `src/app/profile/profile-client.tsx`

- Tambah stat cards: Total XP, Level, Streak, Lessons Completed
- Tambah badge section (misal: "Python Starter", "7-Day Streak")
- Achievement unlocks

#### [MODIFY] `src/components/Topbar.tsx`

- Tampilkan Level badge di samping XP pill

---

### FASE 6 — Practice / Playground Page

#### [MODIFY] `src/app/practice/page.tsx`

- Free coding playground dengan Monaco Editor
- Pilih bahasa (Python, JavaScript)
- Run code dan lihat output
- Tidak perlu login

---

### FASE 7 — SEO & Meta + Layout Polish

#### [MODIFY] `src/app/layout.tsx`

```tsx
export const metadata = {
  title: 'KodeIn — Belajar Coding Interaktif',
  description: 'Platform belajar coding gratis dengan metode interaktif. Mulai dari Python, JavaScript, dan SQL.',
  openGraph: { ... }
}
```

#### [MODIFY] `src/app/globals.css`

- Tambah Google Fonts (Inter atau Outfit)
- Tambah CSS custom properties untuk color system
- Tambah animasi gradient background
- Mesh/noise texture utility

---

## 📋 Prioritas Eksekusi (Urutan Recommended)

| # | Task                             | Impact      | Effort | Priority |
| - | -------------------------------- | ----------- | ------ | -------- |
| 1 | Landing Page Overhaul            | 🔴 Critical | Medium | P0       |
| 2 | Login Page Redesign              | 🔴 High     | Low    | P0       |
| 3 | Real Python Runner (Piston API)  | 🔴 High     | Medium | P1       |
| 4 | Tambah Konten Kursus (Unit 2)    | 🟡 Medium   | Medium | P1       |
| 5 | Gamifikasi Visual (Level System) | 🟡 Medium   | Medium | P2       |
| 6 | Practice Playground              | 🟢 Nice     | Low    | P2       |
| 7 | SEO + Meta Tags                  | 🟡 Medium   | Low    | P2       |
| 8 | Profile Page Polish              | 🟢 Nice     | Medium | P3       |

---

## ❓ Open Questions

> [!IMPORTANT]
> **Pilih Code Runner:** Mau pakai **Pyodide** (offline WASM, lebih berat ~10MB load) atau **Piston API** (online HTTP, ringan tapi butuh internet)? Rekomendasi saya: **Piston API** untuk MVP, bisa upgrade ke Pyodide nanti.

> [!IMPORTANT]
> **Bahasa Kursus:** Saat ini hanya Python. Apakah mau tambah **JavaScript** atau **SQL** di roadmap berikutnya?

> [!WARNING]
> **Database:** Schema Prisma menunjukkan `provider = "postgresql"` tapi file `dev.db` ada (SQLite). Pastikan `prisma.config.ts` sudah dikonfigurasi dengan benar untuk dev vs prod.

---

## ✅ Verification Plan

### Automated

- Build check: `npm run build` tanpa error
- TypeScript: `tsc --noEmit`

### Manual

- Buka landing page → harus *wow* dalam 3 detik
- Klik "Mulai Belajar" → ke `/learn`
- Kerjakan 1 lesson sampai selesai → XP bertambah
- Coba code yang salah → runner harus reject
- Test dark mode toggle
- Test mobile responsive
