import { getUserByApiKey } from "./db.js";

const staticKeys = (process.env.API_KEYS || "").split(",").map(k => k.trim()).filter(Boolean);

export function validateApiKey(key: string | undefined | null): boolean {
  if (!key) return false;
  if (staticKeys.includes(key)) return true;
  const user = getUserByApiKey(key);
  return !!user;
}

export function extractApiKey(authHeader: string | undefined): string | null {
  if (!authHeader) return null;
  if (authHeader.startsWith("Bearer ")) return authHeader.slice(7).trim();
  return authHeader.trim();
}
