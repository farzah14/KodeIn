"use client";

import { useEffect, useState } from "react";

export function useIsDark() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const read = () => setIsDark(document.documentElement.classList.contains("dark"));
    read();

    // event custom (punya Anda)
    window.addEventListener("kodeln-theme", read);

    // jaga-jaga jika class berubah tanpa event
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      window.removeEventListener("kodeln-theme", read);
      mo.disconnect();
    };
  }, []);

  return isDark;
}
