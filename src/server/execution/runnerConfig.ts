export function runnerBaseUrl(): string | null {
  const value = process.env.PISTON_BASE_URL?.trim();
  if (!value) return null;

  try {
    const url = new URL(value);
    if (process.env.NODE_ENV === "production" && url.protocol !== "https:") {
      return null;
    }
    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}
