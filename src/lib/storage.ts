const KEY = "duocode_progress_v1";
const EVENT_NAME = "duocode-progress";

export type ProgressState = {
  completedStepIds: Record<string, boolean>;
  xp: number;
  streak: { current: number; longest: number; lastActiveISO?: string };
};

export const defaultProgress: ProgressState = {
  completedStepIds: {},
  xp: 0,
  streak: { current: 0, longest: 0 },
};

// --- internal cache (penting untuk useSyncExternalStore)
let cachedRaw: string | null = null;
let cachedParsed: ProgressState = defaultProgress;

function parseProgress(raw: string): ProgressState {
  const parsed = JSON.parse(raw);

  return {
    ...defaultProgress,
    ...parsed,
    streak: { ...defaultProgress.streak, ...(parsed?.streak ?? {}) },
    completedStepIds: { ...(parsed?.completedStepIds ?? {}) },
  };
}

/**
 * Snapshot yang STABLE: kalau localStorage belum berubah,
 * fungsi ini mengembalikan object yang sama (referensi sama).
 */
export function getProgressSnapshot(): ProgressState {
  if (typeof window === "undefined") return defaultProgress;

  const raw = localStorage.getItem(KEY);

  // jika isi localStorage sama, kembalikan object cache yang sama
  if (raw === cachedRaw) return cachedParsed;

  cachedRaw = raw;

  if (!raw) {
    cachedParsed = defaultProgress;
    return cachedParsed;
  }

  try {
    cachedParsed = parseProgress(raw);
  } catch {
    cachedParsed = defaultProgress;
  }

  return cachedParsed;
}

export function saveProgress(p: ProgressState) {
  if (typeof window === "undefined") return;

  const raw = JSON.stringify(p);

  // update cache agar snapshot langsung konsisten
  cachedRaw = raw;
  cachedParsed = p;

  localStorage.setItem(KEY, raw);
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function subscribeProgress(cb: () => void) {
  if (typeof window === "undefined") return () => {};

  const handler = () => cb();

  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener("storage", handler); // update dari tab lain

  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener("storage", handler);
  };
}

/** helper read (aman untuk read-only) */
export function loadProgress(): ProgressState {
  return getProgressSnapshot();
}

/** mark completion + xp + streak */
export function markStepCompleted(stepId: string, xpEarned: number) {
  const base = getProgressSnapshot();

  // clone agar tidak mengubah cachedParsed secara langsung sebelum save
  const p: ProgressState = {
    ...base,
    completedStepIds: { ...base.completedStepIds },
    streak: { ...base.streak },
  };

  // XP hanya bertambah pertama kali step selesai
  if (!p.completedStepIds[stepId]) {
    p.completedStepIds[stepId] = true;
    p.xp += xpEarned;

    const todayISO = new Date().toISOString().slice(0, 10);
    const last = p.streak.lastActiveISO;

    if (!last) {
      p.streak.current = 1;
    } else if (last === todayISO) {
      // sudah aktif hari ini
    } else {
      const lastDate = new Date(last + "T00:00:00Z");
      const diffDays = Math.floor(
        (Date.now() - lastDate.getTime()) / (24 * 3600 * 1000)
      );
      p.streak.current = diffDays === 1 ? p.streak.current + 1 : 1;
    }

    p.streak.lastActiveISO = todayISO;
    p.streak.longest = Math.max(p.streak.longest, p.streak.current);

    saveProgress(p);
  }

  return p;
}
