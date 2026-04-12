import { Topbar } from "@/components/Topbar";
import { HeroCTA, BottomCTA } from "@/components/SmartCTA";
import { Code2, Sparkles, TerminalSquare, Trophy, Zap, CheckCircle2, Terminal, ChevronRight, Star, Flame } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#09090b] selection:bg-indigo-500/30 font-sans">
      <Topbar />

      <main className="overflow-hidden">
        {/* HERO SECTION */}
        <section className="relative px-4 pt-20 pb-24 lg:pt-32 lg:pb-40 mx-auto max-w-7xl">
          {/* Advanced Background Grids & Orbs */}
          <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
          <div className="absolute top-0 right-[15%] -z-10 h-[300px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px] dark:bg-indigo-500/20 animate-pulse mix-blend-screen"></div>
          <div className="absolute top-[20%] left-[10%] -z-10 h-[300px] w-[400px] rounded-full bg-cyan-500/10 blur-[120px] dark:bg-cyan-500/15 animate-pulse delay-1000 mix-blend-screen"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              {/* Animated Badge */}
              <div className="anim-slide-up inline-flex items-center gap-2 rounded-full border border-indigo-200/50 bg-indigo-50/50 px-4 py-1.5 text-sm text-indigo-700 shadow-[0_0_15px_rgba(99,102,241,0.15)] backdrop-blur-md dark:border-indigo-900/50 dark:bg-indigo-900/20 dark:text-indigo-300 transition-transform hover:scale-105">
                <Sparkles size={16} className="text-indigo-500 animate-pulse" />
                <span className="font-bold tracking-wide uppercase text-[11px]">Learn Programming from Scratch</span>
              </div>

              {/* Dynamic Headline */}
              <h1 className="anim-slide-up mt-8 text-5xl font-black tracking-tight text-gray-900 dark:text-white sm:text-6xl md:text-7xl lg:text-[76px] leading-[1.1]" style={{ animationDelay: '100ms' }}>
                Belajar Coding{" "}
                <br className="hidden md:block" />
                <span className="relative inline-block mt-2">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 animate-gradient-x">
                 Tanpa Bosaan! 🚀
                  </span>
                  <div className="absolute -inset-1 -z-10 block rounded-xl bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 blur-xl"></div>
                </span>
              </h1>

              <p className="anim-slide-up mt-8 max-w-xl mx-auto lg:mx-0 text-lg sm:text-xl leading-relaxed text-gray-600 dark:text-zinc-400 font-medium" style={{ animationDelay: '200ms' }}>
                Lewati teori berbelit yang bikin ngantuk. Tulis kode nyata, dapatkan XP, naikkan levelmu, dan rasakan betapa serunya ngoding layaknya main game Mabar! 🎮
              </p>

              <div className="anim-slide-up mt-10" style={{ animationDelay: '300ms' }}>
                <HeroCTA />
              </div>

              {/* Trust Indicators */}
              <div className="anim-slide-up mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-8" style={{ animationDelay: '400ms' }}>
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-10 w-10 rounded-full border-2 border-white dark:border-[#09090b] shadow-sm bg-gradient-to-br from-indigo-${i}00 to-purple-${i}00 flex items-center justify-center overflow-hidden`}>
                       <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i * 123}`} alt="student" className="h-full w-full object-cover" />
                    </div>
                  ))}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white dark:border-[#09090b] bg-gray-100 dark:bg-zinc-800 text-xs font-bold text-gray-600 dark:text-zinc-300">
                    +2k
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={16} fill="currentColor" /> )}
                  </div>
                  <span className="text-sm font-bold text-gray-700 dark:text-zinc-300">5.0 / 5.0</span>
                </div>
              </div>
            </div>

            {/* Right Content - Interactive Editor Graphic */}
            <div className="flex-1 w-full max-w-2xl lg:max-w-none relative anim-slide-up" style={{ animationDelay: '200ms' }}>
               {/* Decorative background glow behind editor */}
               <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-cyan-400 blur-3xl opacity-20 dark:opacity-30 rounded-[40px] mix-blend-screen"></div>
               
               {/* Editor Window */}
               <div className="relative group rounded-3xl border border-gray-200/50 bg-white/50 dark:border-zinc-800/50 dark:bg-black/40 shadow-2xl backdrop-blur-xl overflow-hidden transition-all duration-500 hover:shadow-indigo-500/20 hover:-translate-y-2">
                 {/* Window Header */}
                 <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200/50 dark:border-zinc-800/50 bg-gray-50/50 dark:bg-zinc-900/50">
                    <div className="flex gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-400"></div>
                      <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                      <div className="h-3 w-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-black shadow-sm text-xs font-bold text-gray-500 dark:text-zinc-400">
                      <Code2 size={12} className="text-indigo-500" /> main.py
                    </div>
                 </div>
                 {/* Editor Body */}
                 <div className="p-6 font-mono text-sm sm:text-base selection:bg-indigo-500/30">
                    <div className="flex">
                      <span className="text-gray-400 w-8 select-none">1</span>
                      <span className="text-purple-600 dark:text-purple-400 font-bold">def</span>
                      <span className="text-blue-600 dark:text-blue-400 ml-2">become_hacker</span>
                      <span className="text-gray-600 dark:text-gray-300">(skill_level):</span>
                    </div>
                    <div className="flex mt-1">
                      <span className="text-gray-400 w-8 select-none">2</span>
                      <span className="text-gray-400 ml-8">"""Fungsi ajaib KodeIn"""</span>
                    </div>
                    <div className="flex mt-1">
                      <span className="text-gray-400 w-8 select-none">3</span>
                      <span className="text-purple-600 dark:text-purple-400 ml-8 font-bold">if</span>
                      <span className="text-gray-800 dark:text-zinc-200 ml-2">skill_level &lt;</span>
                      <span className="text-orange-500 ml-2">100</span>
                      <span className="text-gray-600 dark:text-gray-300">:</span>
                    </div>
                    <div className="flex mt-1 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors rounded-r">
                      <span className="text-gray-400 w-8 select-none">4</span>
                      <span className="text-purple-600 dark:text-purple-400 ml-16 font-bold">return</span>
                      <span className="text-green-600 dark:text-green-400 ml-2">"Latihan di KodeIn dulu!"</span>
                      <div className="w-2 h-5 bg-indigo-500 ml-1 animate-pulse hidden group-hover:block"></div>
                    </div>
                 </div>
               </div>

               {/* Floating elements */}
               <div className="absolute -right-8 top-16 hidden lg:flex items-center gap-3 rounded-2xl bg-white dark:bg-zinc-900 p-4 shadow-xl shadow-amber-500/10 border border-gray-100 dark:border-zinc-800 animate-bounce" style={{ animationDuration: '4s' }}>
                 <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-500">
                   <Trophy size={24} />
                 </div>
                 <div>
                   <p className="text-xs font-bold uppercase text-gray-500 dark:text-zinc-400">Level Up!</p>
                   <p className="text-lg font-black text-gray-900 dark:text-white">+500 XP</p>
                 </div>
               </div>
               
               <div className="absolute -left-12 bottom-12 hidden lg:flex items-center gap-3 rounded-2xl bg-white dark:bg-zinc-900 p-4 shadow-xl shadow-green-500/10 border border-gray-100 dark:border-zinc-800 animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }}>
                 <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-500">
                   <CheckCircle2 size={24} />
                 </div>
                 <div>
                   <p className="text-xs font-bold uppercase text-gray-500 dark:text-zinc-400">Status</p>
                   <p className="text-lg font-black text-gray-900 dark:text-white">Run Success</p>
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION - Dynamic Cards */}
        <section className="relative z-20 bg-white py-32 dark:bg-zinc-950 border-y border-gray-100 dark:border-zinc-900">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-50/50 via-white to-white dark:from-zinc-900/20 dark:via-zinc-950 dark:to-zinc-950"></div>
          
          <div className="relative mx-auto max-w-7xl px-4">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                Bukan Sekadar Baca Teori Kosong
              </h2>
              <p className="mt-6 text-xl text-gray-600 dark:text-zinc-400 font-medium leading-relaxed">
                Platform ini didesain agar otakmu langsung menyerap ilmu melalui praktik eksekusi kode detik itu juga.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 px-4">
              {/* Interactive Card 1 */}
              <div className="group relative rounded-[32px] bg-gray-50 p-8 transition-all hover:bg-white dark:bg-zinc-900/40 dark:hover:bg-zinc-900 border border-transparent hover:border-gray-200 dark:hover:border-zinc-800 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2">
                <div className="absolute inset-0 rounded-[32px] bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                <div className="relative z-10">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 transition-transform group-hover:scale-110 group-hover:rotate-3 dark:bg-indigo-900/30 dark:text-indigo-400">
                    <TerminalSquare size={28} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">Eksekusi Instan</h3>
                  <p className="mt-4 text-gray-600 dark:text-zinc-400 leading-relaxed font-medium">
                    Tanpa perlu install Python/Node di laptopmu. Tulis program, klik Run, dan lihat mesin server kami mengeksekusinya dalam millisecond.
                  </p>
                </div>
              </div>

              {/* Interactive Card 2 */}
              <div className="group relative rounded-[32px] bg-gray-50 p-8 transition-all hover:bg-white dark:bg-zinc-900/40 dark:hover:bg-zinc-900 border border-transparent hover:border-gray-200 dark:hover:border-zinc-800 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2">
                <div className="absolute inset-0 rounded-[32px] bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                <div className="relative z-10">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 transition-transform group-hover:scale-110 group-hover:-rotate-3 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <Zap size={28} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">Bite-Sized Action</h3>
                  <p className="mt-4 text-gray-600 dark:text-zinc-400 leading-relaxed font-medium">
                    Tidak ada materi membaca 10 halaman. Setiap konsep langsung dikerjakan menjadi 1 tes kode yang cepat dan menyenangkan.
                  </p>
                </div>
              </div>

              {/* Interactive Card 3 */}
              <div className="group relative rounded-[32px] bg-gray-50 p-8 transition-all hover:bg-white dark:bg-zinc-900/40 dark:hover:bg-zinc-900 border border-transparent hover:border-gray-200 dark:hover:border-zinc-800 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2">
                <div className="absolute inset-0 rounded-[32px] bg-gradient-to-b from-orange-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                <div className="relative z-10">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 transition-transform group-hover:scale-110 group-hover:rotate-12 dark:bg-orange-900/30 dark:text-orange-400">
                    <Flame size={28} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">Sistem Streak & XP</h3>
                  <p className="mt-4 text-gray-600 dark:text-zinc-400 leading-relaxed font-medium">
                    Pertahankan api harianmu menyala! Dapatkan XP di setiap penyelesaian logikamu dan berlomba mencapai level programmer teratas🔥.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA - Dynamic Panel */}
        <section className="py-24 px-4 sm:px-6">
          <div className="mx-auto max-w-6xl relative group">
            {/* Animated Gradient Glow */}
            <div className="absolute -inset-1 rounded-[42px] bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 opacity-20 blur-xl transition-opacity duration-500 group-hover:opacity-40"></div>
            
            <div className="relative overflow-hidden rounded-[40px] bg-gray-900 dark:bg-zinc-900 border border-gray-800 px-6 py-24 text-center">
              {/* Complex Web Background Inside Panel */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
              <div className="absolute top-0 right-0 h-[300px] w-[300px] bg-indigo-500/30 rounded-full blur-[100px] mix-blend-screen"></div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-sm mb-8">
                  <Terminal size={16} className="text-cyan-400" />
                  Print("Hello Future Developer")
                </div>
                
                <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
                  Gaskeun Kodingmu,<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Dari Nol Sampai Pro</span>
                </h2>
                
                <p className="mt-8 text-xl text-gray-400 max-w-2xl mx-auto font-medium">
                  Bergabung dengan ribuan orang lainnya. Gratis 100%, akses tanpa batas ke playground dan modul-modul terbaik.
                </p>
                
                <div className="mt-12 flex justify-center">
                  <BottomCTA />
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Mini Footer */}
      <footer className="border-t border-gray-200 bg-white py-10 text-center dark:border-zinc-900 dark:bg-[#09090b]">
        <p className="font-bold text-sm text-gray-400 dark:text-zinc-600 tracking-wide uppercase">
          © {new Date().getFullYear()} KodeIn Space. Never Stop Typing.
        </p>
      </footer>
    </div>
  );
}
