import "server-only";

export const STREAK_TIME_ZONE = "Asia/Jakarta";

/** ISO date (YYYY-MM-DD) of the "streak day" in the app's audience timezone.
 * Deriving it from UTC (new Date().toISOString()) attributed early-morning
 * completions in UTC+7 to the previous day and silently reset streaks. */
export function getActivityDateISO(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: STREAK_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}