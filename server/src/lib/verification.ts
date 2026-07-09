const store = new Map<string, { code: string; expiresAt: number; attempts: number }>();
const CODE_EXPIRY_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export function createVerificationCode(email: string): string {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  store.set(email, { code, expiresAt: Date.now() + CODE_EXPIRY_MS, attempts: 0 });
  return code;
}

export function verifyCode(email: string, code: string): { valid: boolean; error?: string } {
  const entry = store.get(email);
  if (!entry) return { valid: false, error: "No code found. Request a new one." };
  if (Date.now() > entry.expiresAt) { store.delete(email); return { valid: false, error: "Code expired." }; }
  if (entry.attempts >= MAX_ATTEMPTS) { store.delete(email); return { valid: false, error: "Too many attempts." }; }
  entry.attempts++;
  if (entry.code !== code.trim()) return { valid: false, error: `Invalid code. ${MAX_ATTEMPTS - entry.attempts} attempts left.` };
  store.delete(email);
  return { valid: true };
}

export function canSendCode(email: string): boolean {
  const entry = store.get(email);
  if (!entry) return true;
  return Date.now() - (entry.expiresAt - CODE_EXPIRY_MS) > 60000;
}
