const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX || "200", 10);
const RATE_LIMIT_WINDOW_MS = parseInt(
  process.env.RATE_LIMIT_WINDOW_MS || "2592000000", // 30 days default
  10
);

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

// In-memory store. For a single-server MVP this is sufficient.
// Upgrade to Redis when scaling horizontally.
const store = new Map<string, RateLimitEntry>();

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetsAt?: string;
}

/**
 * Check and consume one unit of rate limit for the given API key.
 */
export function checkRateLimit(apiKey: string): RateLimitResult {
  const now = Date.now();
  let entry = store.get(apiKey);

  // New window or expired
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    entry = { count: 0, windowStart: now };
    store.set(apiKey, entry);
  }

  const resetsAt = new Date(
    entry.windowStart + RATE_LIMIT_WINDOW_MS
  ).toISOString();

  if (entry.count >= RATE_LIMIT_MAX) {
    return {
      allowed: false,
      limit: RATE_LIMIT_MAX,
      remaining: 0,
      resetsAt,
    };
  }

  entry.count++;

  return {
    allowed: true,
    limit: RATE_LIMIT_MAX,
    remaining: RATE_LIMIT_MAX - entry.count,
    resetsAt,
  };
}

/**
 * Reset rate limit for a specific key (useful for plan upgrades via webhook).
 */
export function resetRateLimit(apiKey: string): void {
  store.delete(apiKey);
}

/**
 * Set custom limit for a key (for paid plans).
 * In production, this would come from a database.
 */
export function getRemainingQuota(apiKey: string): number {
  const entry = store.get(apiKey);
  if (!entry) return RATE_LIMIT_MAX;
  return Math.max(0, RATE_LIMIT_MAX - entry.count);
}
