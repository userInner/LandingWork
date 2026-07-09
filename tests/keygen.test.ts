import { describe, it, expect } from "vitest";
import { generateApiKey } from "@/lib/keygen";

describe("API Key Generation", () => {
  it("should generate a key with sf_ prefix", () => {
    const key = generateApiKey();
    expect(key.startsWith("sf_")).toBe(true);
  });

  it("should generate a key of correct length (sf_ + 32 hex chars)", () => {
    const key = generateApiKey();
    expect(key.length).toBe(3 + 32); // "sf_" + 32 hex chars
  });

  it("should only contain valid hex characters after prefix", () => {
    const key = generateApiKey();
    const hex = key.slice(3);
    expect(hex).toMatch(/^[0-9a-f]{32}$/);
  });

  it("should generate unique keys", () => {
    const keys = new Set(Array.from({ length: 100 }, () => generateApiKey()));
    expect(keys.size).toBe(100);
  });
});
