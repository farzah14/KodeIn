"use client";

import { Topbar } from "@/components/Topbar";
import { HeroCTA, BottomCTA } from "@/components/SmartCTA";
import { TerminalSquare, Flame, Code2, Users } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function Page() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-edu-bg text-edu-textPrimary font-sans">
      <Topbar />

      <main>
        {/* HERO SECTION */}
        <section className="py-16 md:py-24 lg:py-32 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              
              {/* Left Content */}
              <div className="flex-1 lg:pr-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-edu-border px-3 py-1 mb-8">
                  <Users size={14} className="text-edu-textSecondary" />
                  <span className="text-xs font-medium text-edu-textSecondary uppercase tracking-widest">{t("hero.badge")}</span>
                </div>

                {/* Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight mb-6 text-edu-textPrimary">
                  {t("hero.title")} <br />
                  <span className="text-edu-primary">Interactive Learning</span>
                </h1>

                {/* Subtext */}
                <p className="text-base text-edu-textSecondary max-w-lg mb-8 leading-relaxed">
                  {t("hero.subtitle")}
                </p>

                {/* CTA */}
                <HeroCTA />
              </div>

              {/* Right Content - Live Code Preview */}
              <div className="flex-1 w-full max-w-xl lg:max-w-none">
                <div className="rounded-[10px] bg-edu-surface2 border border-edu-border overflow-hidden">
                  {/* Editor Header */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-edu-border bg-edu-surface1">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-edu-error/50"></div>
                      <div className="w-3 h-3 rounded-full bg-edu-streak/50"></div>
                      <div className="w-3 h-3 rounded-full bg-edu-success/50"></div>
                    </div>
                    <div className="ml-4 text-xs font-medium text-edu-textMuted font-mono">kodein-demo.py</div>
                  </div>
                  
                  {/* Editor Body */}
                  <div className="p-4 font-mono text-[13px] leading-relaxed bg-edu-codeBg overflow-x-auto text-edu-textSecondary">
                    <div className="flex">
                      <span className="text-edu-textMuted w-8 select-none">1</span>
                      <span><span className="text-edu-primary">def</span> calculate_xp(missions):</span>
                    </div>
                    <div className="flex bg-edu-border/30">
                      <span className="text-edu-textMuted w-8 select-none">2</span>
                      <span className="pl-4">total_xp = <span className="text-edu-streak">0</span></span>
                    </div>
                    <div className="flex">
                      <span className="text-edu-textMuted w-8 select-none">3</span>
                      <span className="pl-4"><span className="text-edu-primary">for</span> mission <span className="text-edu-primary">in</span> missions:</span>
                    </div>
                    <div className="flex">
                      <span className="text-edu-textMuted w-8 select-none">4</span>
                      <span className="pl-8"><span className="text-edu-primary">if</span> mission.completed:</span>
                    </div>
                    <div className="flex">
                      <span className="text-edu-textMuted w-8 select-none">5</span>
                      <span className="pl-12">total_xp += mission.reward</span>
                    </div>
                    <div className="flex">
                      <span className="text-edu-textMuted w-8 select-none">6</span>
                      <span className="pl-4"><span className="text-edu-primary">return</span> total_xp</span>
                    </div>
                  </div>

                  {/* Terminal Status Bar */}
                  <div className="px-4 py-3 bg-edu-bg border-t border-edu-border flex items-center justify-between">
                    <div className="text-xs font-mono text-edu-textSecondary">
                      &gt; Python 3.10 runtime
                    </div>
                    <div className="text-xs font-mono text-edu-success">Success</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-16 md:py-24 px-6 bg-edu-bg">
          <div className="mx-auto max-w-7xl">
            <div className="grid md:grid-cols-3 gap-6">
              
              {/* Feature Card 1 */}
              <div className="p-8 rounded-xl bg-edu-surface1 border border-edu-border">
                 <div className="w-10 h-10 rounded-lg bg-edu-primary/10 text-edu-primary flex items-center justify-center mb-6">
                    <TerminalSquare size={20} />
                 </div>
                 <h3 className="text-[18px] font-semibold text-edu-textPrimary mb-3">{t("features.instant.title")}</h3>
                 <p className="text-[14px] text-edu-textSecondary leading-relaxed">
                   {t("features.instant.desc")}
                 </p>
              </div>

              {/* Feature Card 2 */}
              <div className="p-8 rounded-xl bg-edu-surface1 border border-edu-border">
                 <div className="w-10 h-10 rounded-lg bg-edu-xp/10 text-edu-xp flex items-center justify-center mb-6">
                    <Code2 size={20} />
                 </div>
                 <h3 className="text-[18px] font-semibold text-edu-textPrimary mb-3">{t("features.bite.title")}</h3>
                 <p className="text-[14px] text-edu-textSecondary leading-relaxed">
                   {t("features.bite.desc")}
                 </p>
              </div>

              {/* Feature Card 3 */}
              <div className="p-8 rounded-xl bg-edu-surface1 border border-edu-border">
                 <div className="w-10 h-10 rounded-lg bg-edu-streak/10 text-edu-streak flex items-center justify-center mb-6">
                    <Flame size={20} />
                 </div>
                 <h3 className="text-[18px] font-semibold text-edu-textPrimary mb-3">{t("features.habit.title")}</h3>
                 <p className="text-[14px] text-edu-textSecondary leading-relaxed">
                   {t("features.habit.desc")}
                 </p>
              </div>

            </div>
          </div>
        </section>

        {/* BOTTOM CTA SECTION */}
        <section className="py-24 px-6 border-t border-edu-border bg-edu-bg">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-edu-textPrimary mb-6">{t("cta.ready")}</h2>
            <p className="text-edu-textSecondary mb-8 text-base">
              {t("cta.join")}
            </p>
            <BottomCTA />
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-xs font-medium text-edu-textMuted border-t border-edu-border bg-edu-bg">
        © {new Date().getFullYear()} KodeIn Learning. All rights reserved.
      </footer>
    </div>
  );
}
