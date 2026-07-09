import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    API_KEYS: process.env.API_KEYS,
    hasKey: (process.env.API_KEYS || "").includes("sk_test"),
    allEnvKeys: Object.keys(process.env).filter(k => k.startsWith("API") || k.startsWith("RESEND") || k.startsWith("FROM")),
  });
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const xApiKey = request.headers.get("x-api-key");
  const allHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => { allHeaders[key] = value; });
  const apiKey = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;
  const envKeys = (process.env.API_KEYS || "").split(",").map(k => k.trim()).filter(Boolean);
  
  return NextResponse.json({
    receivedKey: apiKey,
    authHeader,
    xApiKey,
    allHeaders,
    envKeys,
    match: apiKey ? envKeys.includes(apiKey) : false,
  });
}
