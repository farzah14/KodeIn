import "server-only";
import { prisma } from "@/lib/prisma";

export type DbRateLimitOptions = {
  windowMs: number;
  max: number;
};

export type DbRateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

export const REGISTER_WINDOW_MS = 10 * 60 * 1000;
export const REGISTER_MAX_PER_IP = 5;
export const RESEND_WINDOW_MS = 60 * 1000;
export const RESEND_MAX_PER_KEY = 1;
export const FORGOT_PASSWORD_WINDOW_MS = 60 * 1000;
export const FORGOT_PASSWORD_MAX_PER_KEY = 1;
export const RESET_PASSWORD_WINDOW_MS = 10 * 60 * 1000;
export const RESET_PASSWORD_MAX_PER_IP = 10;
export const CONTACT_WINDOW_MS = 10 * 60 * 1000;
export const CONTACT_MAX_PER_IP = 5;

export async function checkDbRateLimit(
  key: string,
  options: DbRateLimitOptions
): Promise<DbRateLimitResult> {
  const now = Date.now();
  const windowStart = new Date(Math.floor(now / options.windowMs) * options.windowMs);
  const expiresAt = new Date(windowStart.getTime() + options.windowMs);
  const bucket = await prisma.rateLimitBucket.upsert({
    where: { key_windowStart: { key, windowStart } },
    create: { key, windowStart, expiresAt, count: 1 },
    update: { count: { increment: 1 } },
  });

  const allowed = bucket.count <= options.max;
  if (!allowed) {
    await Promise.resolve(
      prisma.rateLimitBucket.update({
        where: { key_windowStart: { key, windowStart } },
        data: { count: { decrement: 1 } },
      })
    ).catch(() => {});
  }

  await Promise.resolve(
    prisma.rateLimitBucket.deleteMany({ where: { expiresAt: { lt: new Date(now) } } })
  ).catch(() => {});

  return {
    allowed,
    retryAfterSeconds: allowed
      ? 0
      : Math.max(1, Math.ceil((bucket.expiresAt.getTime() - now) / 1000)),
  };
}

export function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip") || "unknown-ip";
}
