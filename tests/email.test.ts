import { describe, it, expect } from "vitest";
import { sendVerificationEmail } from "@/lib/email";

describe("Email Sending (Integration - Resend)", () => {
  it("should send a verification email to the Resend test inbox", async () => {
    const result = await sendVerificationEmail(
      "delivered@resend.dev", // Resend's built-in test recipient
      "123456"
    );

    expect(result.success).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("should return error for unauthorized recipients (unverified domain)", async () => {
    // Before domain verification, Resend only allows sending to:
    // 1. delivered@resend.dev (test inbox)
    // 2. Your own account email
    // All other recipients will be rejected with a 403
    const result = await sendVerificationEmail("stranger@random.com", "654321");

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
