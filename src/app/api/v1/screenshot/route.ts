import { NextRequest, NextResponse } from "next/server";
import { takeScreenshot, type ScreenshotOptions } from "@/lib/screenshot";
import { validateApiKey } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  // 1. Auth - inline check for debugging
  const authHeader = request.headers.get("authorization");
  const apiKey = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;
  const envKeys = (process.env.API_KEYS || "").split(",").map(k => k.trim()).filter(Boolean);
  
  if (!apiKey || !envKeys.includes(apiKey)) {
    // Also check user DB keys
    let dbValid = false;
    try {
      const { getUserByApiKey } = await import("@/lib/db");
      const user = getUserByApiKey(apiKey || "");
      if (user) dbValid = true;
    } catch {}

    if (!dbValid) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Invalid or missing API key." },
        { status: 401 }
      );
    }
  }

  const authKey = apiKey!;

  // 2. Rate limiting
  const rateLimitResult = checkRateLimit(authKey);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded",
        message: `You have exceeded your monthly quota. Upgrade your plan for more requests.`,
        limit: rateLimitResult.limit,
        remaining: 0,
        resetsAt: rateLimitResult.resetsAt,
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(rateLimitResult.limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": rateLimitResult.resetsAt!,
        },
      }
    );
  }

  // 3. Parse body
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Bad request", message: "Invalid JSON body." },
      { status: 400 }
    );
  }

  // 4. Validate params
  const options: ScreenshotOptions = {};

  if (body.url && typeof body.url === "string") {
    options.url = body.url;
  } else if (body.html && typeof body.html === "string") {
    options.html = body.html;
  } else {
    return NextResponse.json(
      {
        error: "Bad request",
        message: "Provide either 'url' (string) or 'html' (string) in the request body.",
      },
      { status: 400 }
    );
  }

  if (body.url && body.html) {
    return NextResponse.json(
      {
        error: "Bad request",
        message: "Provide either 'url' or 'html', not both.",
      },
      { status: 400 }
    );
  }

  // Optional params with validation
  const format = body.format as string | undefined;
  if (format && !["png", "jpeg", "pdf"].includes(format)) {
    return NextResponse.json(
      { error: "Bad request", message: "Format must be 'png', 'jpeg', or 'pdf'." },
      { status: 400 }
    );
  }
  options.format = (format as ScreenshotOptions["format"]) || "png";

  if (body.width !== undefined) {
    const w = Number(body.width);
    if (isNaN(w) || w < 100 || w > 3840) {
      return NextResponse.json(
        { error: "Bad request", message: "Width must be between 100 and 3840." },
        { status: 400 }
      );
    }
    options.width = w;
  }

  if (body.height !== undefined) {
    const h = Number(body.height);
    if (isNaN(h) || h < 100 || h > 2160) {
      return NextResponse.json(
        { error: "Bad request", message: "Height must be between 100 and 2160." },
        { status: 400 }
      );
    }
    options.height = h;
  }

  if (body.fullPage !== undefined) options.fullPage = Boolean(body.fullPage);
  if (body.quality !== undefined) options.quality = Number(body.quality);
  if (body.deviceScaleFactor !== undefined)
    options.deviceScaleFactor = Math.min(3, Math.max(1, Number(body.deviceScaleFactor)));
  if (body.waitAfterLoad !== undefined)
    options.waitAfterLoad = Math.min(10000, Math.max(0, Number(body.waitAfterLoad)));
  if (body.waitForSelector !== undefined && typeof body.waitForSelector === "string")
    options.waitForSelector = body.waitForSelector;
  if (body.darkMode !== undefined) options.darkMode = Boolean(body.darkMode);

  // 5. Take screenshot
  try {
    const result = await takeScreenshot(options);

    return new NextResponse(result.data, {
      status: 200,
      headers: {
        "Content-Type": result.contentType,
        "X-RateLimit-Limit": String(rateLimitResult.limit),
        "X-RateLimit-Remaining": String(rateLimitResult.remaining),
        "Cache-Control": "no-store",
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Screenshot capture failed.";

    // Capacity error
    if (message.includes("at capacity")) {
      return NextResponse.json(
        { error: "Service busy", message },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Screenshot failed", message },
      { status: 500 }
    );
  }
}
