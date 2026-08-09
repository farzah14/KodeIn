/**
 * Dependency-free in-memory sliding-window rate limiter.
 *
 * Fair warning: state lives in one process instance. On serverless platforms
 * each cold start gets a fresh window, so this bounds abuse per instance but
 * is not a global guarantee. It is still a meaningful cost/abuse gate and the
 * only option that needs no schema or external store.
 */

export type MemoryRateLimiterOptions = {
  windowMs: number;
  max: number;
};

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

export class MemoryRateLimiter {
  private hits = new Map<string, number[]>();

  constructor(private readonly options: MemoryRateLimiterOptions) {}

  check(key: string, now: number = Date.now()): RateLimitResult {
    const { windowMs, max } = this.options;
    const recent = (this.hits.get(key) ?? []).filter((t) => now - t < windowMs);

    if (recent.length === 0) {
      this.hits.delete(key);
    } else {
      this.hits.set(key, recent);
    }

    if (recent.length >= max) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((windowMs - (now - recent[0])) / 1000)
      );
      return { allowed: false, retryAfterSeconds };
    }

    recent.push(now);
    this.hits.set(key, recent);
    return { allowed: true, retryAfterSeconds: 0 };
  }
}

export const REGISTER_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
export const REGISTER_MAX_PER_IP = 5;

export const registerLimiter = new MemoryRateLimiter({
  windowMs: REGISTER_WINDOW_MS,
  max: REGISTER_MAX_PER_IP,
});

export const RESEND_WINDOW_MS = 60 * 1000; // 1 minute
export const RESEND_MAX_PER_KEY = 1;

export const resendLimiter = new MemoryRateLimiter({
  windowMs: RESEND_WINDOW_MS,
  max: RESEND_MAX_PER_KEY,
});

export function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip") || "unknown-ip";
}