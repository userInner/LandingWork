const LIMIT = parseInt(process.env.RATE_LIMIT_MAX || "200", 10);
const WINDOW = 30 * 24 * 60 * 60 * 1000; // 30 days
const store = new Map<string, { count: number; start: number }>();

export function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  let entry = store.get(key);
  if (!entry || now - entry.start > WINDOW) { entry = { count: 0, start: now }; store.set(key, entry); }
  if (entry.count >= LIMIT) return { allowed: false, remaining: 0 };
  entry.count++;
  return { allowed: true, remaining: LIMIT - entry.count };
}
