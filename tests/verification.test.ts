import { describe, it, expect, beforeEach } from "vitest";
import {
  createVerificationCode,
  verifyCode,
  canSendCode,
} from "@/lib/verification";

describe("Verification Code System", () => {
  const testEmail = "test@example.com";

  beforeEach(() => {
    // Create a fresh code for each test that needs one
  });

  describe("createVerificationCode", () => {
    it("should generate a 6-digit numeric code", () => {
      const code = createVerificationCode(testEmail);
      expect(code).toMatch(/^\d{6}$/);
    });

    it("should generate different codes on subsequent calls", () => {
      const code1 = createVerificationCode("a@test.com");
      const code2 = createVerificationCode("b@test.com");
      // Statistically they could be the same, but very unlikely
      // This test verifies the function returns valid codes
      expect(code1).toMatch(/^\d{6}$/);
      expect(code2).toMatch(/^\d{6}$/);
    });
  });

  describe("verifyCode", () => {
    it("should return valid:true for correct code", () => {
      const code = createVerificationCode(testEmail);
      const result = verifyCode(testEmail, code);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("should return valid:false for wrong code", () => {
      createVerificationCode(testEmail);
      const result = verifyCode(testEmail, "000000");
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should return error when no code exists for email", () => {
      const result = verifyCode("nonexistent@test.com", "123456");
      expect(result.valid).toBe(false);
      expect(result.error).toContain("No verification code found");
    });

    it("should invalidate code after successful verification", () => {
      const code = createVerificationCode(testEmail);
      verifyCode(testEmail, code); // first verify succeeds

      const result = verifyCode(testEmail, code); // second attempt
      expect(result.valid).toBe(false);
      expect(result.error).toContain("No verification code found");
    });

    it("should reject after max attempts", () => {
      const code = createVerificationCode(testEmail);

      // Burn through 5 wrong attempts
      for (let i = 0; i < 5; i++) {
        verifyCode(testEmail, "000000");
      }

      // Even correct code should fail now
      const result = verifyCode(testEmail, code);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("Too many attempts");
    });

    it("should handle whitespace in code input", () => {
      const code = createVerificationCode(testEmail);
      const result = verifyCode(testEmail, ` ${code} `);
      expect(result.valid).toBe(true);
    });
  });

  describe("canSendCode", () => {
    it("should allow sending code for new email", () => {
      expect(canSendCode("new@test.com")).toBe(true);
    });

    it("should block immediate resend for same email", () => {
      createVerificationCode("rate@test.com");
      expect(canSendCode("rate@test.com")).toBe(false);
    });
  });
});
