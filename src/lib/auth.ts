import { NextRequest } from "next/server";

export interface AuthResult {
  valid: boolean;
  key?: string;
}

/**
 * Validate API key from request headers.
 * Accepts: `Authorization: Bearer sf_xxx` or `X-API-Key: sf_xxx`
 */
export function validateApiKey(request: NextRequest): AuthResult {
  let key: string | null = null;

  // Try Authorization header first
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    key = authHeader.slice(7).trim();
  }

  // Fallback to X-API-Key header
  if (!key) {
    key = request.headers.get("x-api-key")?.trim() || null;
  }

  if (!key) {
    return { valid: false };
  }

  // Check static keys (from env)
  const envKeys = process.env.API_KEYS || "";
  const staticKeys = envKeys.split(",").map((k) => k.trim()).filter(Boolean);

  if (staticKeys.includes(key)) {
    return { valid: true, key };
  }

  // Check user-generated keys (from file DB)
  try {
    // Dynamic import to avoid module-level fs issues
    const { getUserByApiKey } = require("./db");
    const user = getUserByApiKey(key);
    if (user) {
      return { valid: true, key };
    }
  } catch {
    // DB not available, skip
  }

  return { valid: false };
}
