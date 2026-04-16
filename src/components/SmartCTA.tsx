"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useTranslation } from "@/lib/i18n";

export function HeroCTA() {
  const { t } = useTranslation();
  const { status } = useSession();
  const dest = status === "authenticated" ? "/learn" : "/login";

  return (
    <div className="flex items-center gap-4">
      <Link
        href={dest}
        className="flex items-center justify-center h-12 px-6 rounded-lg bg-edu-primary text-white font-semibold hover:bg-edu-primaryHover focus:outline-none focus:ring-2 focus:ring-edu-primary focus:ring-offset-2 focus:ring-offset-edu-bg transition-all"
      >
        {t("hero.cta")}
      </Link>
      
      <Link
        href="/learn"
        className="flex items-center justify-center h-12 px-6 rounded-lg bg-transparent text-edu-textSecondary hover:text-edu-textPrimary font-semibold transition-all"
      >
        {t("hero.map")}
      </Link>
    </div>
  );
}

export function BottomCTA() {
  const { status } = useSession();
  const { t } = useTranslation();
  const dest = status === "authenticated" ? "/learn" : "/login";

  return (
    <Link
      href={dest}
      className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-edu-primary text-white font-semibold hover:bg-edu-primaryHover focus:outline-none focus:ring-2 focus:ring-edu-primary focus:ring-offset-2 focus:ring-offset-edu-bg transition-all"
    >
      {t("cta.start")}
    </Link>
  );
}
