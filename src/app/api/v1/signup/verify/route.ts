import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/lib/db";
import { generateApiKey } from "@/lib/keygen";
import { verifyCode } from "@/lib/verification";

/**
 * Step 2: Verify code and issue API key.
 * POST /api/v1/signup/verify
 * Body: { email: "user@example.com", code: "123456" }
 */
export async function POST(request: NextRequest) {
  let body: { email?: string; code?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Bad request", message: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const email = body.email?.trim().toLowerCase();
  const code = body.code?.trim();

  if (!email || !code) {
    return NextResponse.json(
      { error: "Bad request", message: "Email and code are required." },
      { status: 400 }
    );
  }

  // Check if user already exists
  const existing = getUserByEmail(email);
  if (existing) {
    return NextResponse.json({
      apiKey: existing.apiKey,
      message: "Welcome back! Here's your existing API key.",
    });
  }

  // Verify code
  const result = verifyCode(email, code);

  if (!result.valid) {
    return NextResponse.json(
      { error: "Invalid code", message: result.error },
      { status: 400 }
    );
  }

  // Create user and issue API key
  const apiKey = generateApiKey();
  createUser({ email, apiKey });

  return NextResponse.json({
    apiKey,
    message: "Email verified! Your API key is ready.",
  });
}
