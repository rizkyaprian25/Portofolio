// Pembatas laju permintaan (in-memory sliding window rate limiter) untuk keamanan endpoint
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Bersihkan entri kedaluwarsa secara berkala setiap 10 menit
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    rateLimitMap.forEach((entry, ip) => {
      if (now > entry.resetTime) {
        rateLimitMap.delete(ip);
      }
    });
  }, 10 * 60 * 1000);
}

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 5,
  windowMs: number = 15 * 60 * 1000 // Jendela waktu batas: 15 menit
): { allowed: boolean; remaining: number; retryAfterSec: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { allowed: true, remaining: maxRequests - 1, retryAfterSec: 0 };
  }

  if (entry.count >= maxRequests) {
    const retryAfterSec = Math.ceil((entry.resetTime - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSec };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    retryAfterSec: 0,
  };
}

export function resetRateLimit(identifier: string): void {
  rateLimitMap.delete(identifier);
}
