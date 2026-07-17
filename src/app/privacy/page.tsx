"use client";

import Link from "next/link";
import { ArrowLeft, TerminalSquare, ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-gray-900 dark:text-zinc-100 px-6 py-16 md:py-24 relative overflow-hidden">
      {/* Background mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000002_1px,transparent_1px),linear-gradient(to_bottom,#00000002_1px,transparent_1px)] bg-[size:32px_32px] dark:bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)]"></div>
      <div className="absolute -left-20 -top-20 h-[400px] w-[400px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Navigation */}
        <div className="mb-10">
          <Link href="/signup" className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Kembali ke Pendaftaran
          </Link>
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <TerminalSquare size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Kebijakan Privasi KodeIn</h1>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Terakhir diperbarui: 17 Juli 2026</p>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-gray dark:prose-invert max-w-none space-y-6 text-sm leading-relaxed text-gray-600 dark:text-zinc-300">
          <p>
            Di KodeIn, kami berkomitmen untuk melindungi dan menghormati privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat menggunakan platform kami.
          </p>

          <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-8 mb-2">1. Informasi yang Kami Kumpulkan</h2>
          <p>
            Kami mengumpulkan informasi minimal yang diperlukan untuk menyediakan layanan pembelajaran terbaik kepada Anda:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Informasi Pendaftaran:</strong> Nama lengkap, alamat email, dan kata sandi yang telah disandikan (hashed).</li>
            <li><strong>Data Profil Sosial:</strong> Jika Anda memilih login menggunakan Google atau GitHub, kami mengumpulkan ID profil sosial, nama, dan gambar avatar Anda.</li>
            <li><strong>Kemajuan Belajar:</strong> Data latihan yang diselesaikan, XP yang diperoleh, dan riwayat streak belajar Anda.</li>
          </ul>

          <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-8 mb-2">2. Cara Kami Menggunakan Informasi Anda</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Untuk mengelola dan memverifikasi akun Anda.</li>
            <li>Untuk memantau, menyimpan, dan menampilkan progres belajar Anda (XP, leaderboard, streak).</li>
            <li>Untuk memberikan rekomendasi latihan yang sesuai dengan kebutuhan belajar Anda.</li>
            <li>Kami **TIDAK AKAN PERNAH** menjual atau membagikan data pribadi Anda kepada pihak ketiga untuk kepentingan iklan.</li>
          </ul>

          <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-8 mb-2">3. Keamanan Data</h2>
          <p>
            Semua data disimpan secara aman menggunakan protokol enkripsi standar industri. Kata sandi Anda disandikan menggunakan algoritma hashing bcrypt satu arah yang kuat, sehingga tidak ada yang dapat membaca kata sandi asli Anda, termasuk tim internal kami.
          </p>

          <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-8 mb-2">4. Hak Pengguna</h2>
          <p>
            Anda memiliki hak penuh untuk mengakses, memperbarui, atau menghapus informasi pribadi Anda dari sistem kami kapan saja melalui pengaturan profil Anda atau dengan menghubungi tim dukungan kami.
          </p>
        </div>

        {/* Footer info banner */}
        <div className="mt-12 p-5 rounded-2xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 flex items-center gap-3 text-xs text-gray-500 dark:text-zinc-400">
          <ShieldCheck size={18} className="text-indigo-500 shrink-0" />
          <span>Keamanan data Anda adalah prioritas utama kami.</span>
        </div>
      </div>
    </div>
  );
}
