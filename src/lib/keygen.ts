import crypto from "crypto";

/**
 * Generate a unique API key with the `sf_` prefix.
 * Format: sf_<32 random hex chars>
 * Example: sf_a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6
 */
export function generateApiKey(): string {
  const random = crypto.randomBytes(16).toString("hex");
  return `sf_${random}`;
}
