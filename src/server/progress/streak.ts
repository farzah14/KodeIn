export function calculateStreak(
  lastActiveISO: string | null,
  currentStreak: number,
  longestStreak: number,
  todayISO: string
): { current: number; longest: number; lastActiveISO: string } {
  let current = currentStreak ?? 0;
  let longest = longestStreak ?? 0;

  if (!lastActiveISO) {
    current = 1;
  } else if (lastActiveISO === todayISO) {
    // Already active today, streak doesn't change
  } else {
    const lastDate = new Date(lastActiveISO + "T00:00:00Z");
    const todayDate = new Date(todayISO + "T00:00:00Z");
    const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    current = diffDays === 1 ? current + 1 : 1;
  }

  longest = Math.max(longest, current);

  return { current, longest, lastActiveISO: todayISO };
}
