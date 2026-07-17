"use client";

import Link from "next/link";
import { ArrowLeft, TerminalSquare, ShieldCheck } from "lucide-react";

export default function TermsPage() {
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
            <h1 className="text-3xl font-extrabold tracking-tight">Ketentuan Layanan KodeIn</h1>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Terakhir diperbarui: 17 Juli 2026</p>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-gray dark:prose-invert max-w-none space-y-6 text-sm leading-relaxed text-gray-600 dark:text-zinc-300">
          <p>
            Selamat datang di KodeIn. Dengan mengakses atau menggunakan platform kami, Anda setuju untuk terikat oleh Ketentuan Layanan berikut. Harap baca dengan saksama sebelum mendaftar atau menggunakan layanan kami.
          </p>

          <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-8 mb-2">1. Ketentuan Akun</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Anda harus memberikan alamat email yang valid dan informasi pendaftaran yang akurat untuk membuat akun.</li>
            <li>Anda bertanggung jawab penuh untuk menjaga keamanan kredensial akun dan kata sandi Anda.</li>
            <li>KodeIn berhak menolak pendaftaran atau menonaktifkan akun yang melanggar ketentuan penggunaan kami.</li>
          </ul>

          <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-8 mb-2">2. Penggunaan Layanan</h2>
          <p>
            Platform ini disediakan untuk tujuan pendidikan dan pembelajaran coding pribadi. Anda setuju untuk tidak:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Menggunakan kode berbahaya, melakukan peretasan, atau mencoba mengganggu integritas server kami.</li>
            <li>Menyalahgunakan fitur eksekusi kode (sandbox) untuk aktivitas ilegal atau penambangan data.</li>
            <li>Mengunggah atau menyebarkan materi berhak cipta tanpa izin.</li>
          </ul>

          <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-8 mb-2">3. Kepemilikan Konten</h2>
          <p>
            Seluruh konten edukasi, kurikulum, latihan, dan kode platform yang disediakan oleh KodeIn dilindungi oleh hak kekayaan intelektual. Kode yang Anda tulis selama latihan tetap menjadi milik Anda, namun Anda memberikan hak kepada kami untuk menyimpan dan menguji kode tersebut di server kami demi kelancaran proses pembelajaran.
          </p>

          <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-8 mb-2">4. Perubahan Layanan</h2>
          <p>
            Kami terus meningkatkan layanan kami. KodeIn berhak mengubah, menangguhkan, atau menghentikan fitur apa pun dari platform kapan saja dengan atau tanpa pemberitahuan sebelumnya.
          </p>
        </div>

        {/* Footer info banner */}
        <div className="mt-12 p-5 rounded-2xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 flex items-center gap-3 text-xs text-gray-500 dark:text-zinc-400">
          <ShieldCheck size={18} className="text-indigo-500 shrink-0" />
          <span>Kami sangat menghargai privasi dan integritas data Anda. Hubungi kami jika Anda memiliki pertanyaan.</span>
        </div>
      </div>
    </div>
  );
}
