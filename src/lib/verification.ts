/**
 * In-memory store for verification codes.
 * Each code expires after 10 minutes.
 */

interface VerificationEntry {
  code: string;
  email: string;
  expiresAt: number;
  attempts: number;
}

const store = new Map<string, VerificationEntry>();

const CODE_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 5;

/**
 * Generate a 6-digit verification code and store it.
 */
export function createVerificationCode(email: string): string {
  // Clean up expired entries occasionally
  if (store.size > 1000) {
    cleanExpired();
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));

  store.set(email, {
    code,
    email,
    expiresAt: Date.now() + CODE_EXPIRY_MS,
    attempts: 0,
  });

  return code;
}

/**
 * Verify a code for a given email.
 * Returns true if valid, false otherwise.
 */
export function verifyCode(
  email: string,
  code: string
): { valid: boolean; error?: string } {
  const entry = store.get(email);

  if (!entry) {
    return { valid: false, error: "No verification code found. Please request a new one." };
  }

  if (Date.now() > entry.expiresAt) {
    store.delete(email);
    return { valid: false, error: "Code expired. Please request a new one." };
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    store.delete(email);
    return { valid: false, error: "Too many attempts. Please request a new code." };
  }

  entry.attempts++;

  if (entry.code !== code.trim()) {
    return { valid: false, error: `Invalid code. ${MAX_ATTEMPTS - entry.attempts} attempts remaining.` };
  }

  // Success — remove entry
  store.delete(email);
  return { valid: true };
}

/**
 * Check if we recently sent a code to this email (rate limiting).
 * Prevents spam-sending emails.
 */
export function canSendCode(email: string): boolean {
  const entry = store.get(email);
  if (!entry) return true;

  // Allow resend after 60 seconds
  const elapsed = Date.now() - (entry.expiresAt - CODE_EXPIRY_MS);
  return elapsed > 60000;
}

function cleanExpired(): void {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.expiresAt) {
      store.delete(key);
    }
  }
}
