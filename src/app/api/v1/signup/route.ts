import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/lib/db";
import { generateApiKey } from "@/lib/keygen";
import { createVerificationCode, canSendCode } from "@/lib/verification";
import { sendVerificationEmail } from "@/lib/email";

/**
 * Step 1: Send verification code to email.
 * POST /api/v1/signup
 * Body: { email: "user@example.com" }
 */
export async function POST(request: NextRequest) {
  let body: { email?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Bad request", message: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const email = body.email?.trim().toLowerCase();

  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { error: "Bad request", message: "Please provide a valid email address." },
      { status: 400 }
    );
  }

  // Check if user already exists — resend their key directly
  const existing = getUserByEmail(email);
  if (existing) {
    return NextResponse.json({
      step: "done",
      apiKey: existing.apiKey,
      message: "Welcome back! Here's your existing API key.",
    });
  }

  // Rate limit: can't spam verification emails
  if (!canSendCode(email)) {
    return NextResponse.json(
      { error: "Too fast", message: "Please wait 60 seconds before requesting a new code." },
      { status: 429 }
    );
  }

  // Generate and send code
  const code = createVerificationCode(email);
  const result = await sendVerificationEmail(email, code);

  if (!result.success) {
    return NextResponse.json(
      { error: "Email failed", message: "Could not send verification email. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    step: "verify",
    message: "Verification code sent! Check your email.",
  });
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
