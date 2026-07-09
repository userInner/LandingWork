import type { FastifyRequest, FastifyReply } from "fastify";
import { extractApiKey, validateApiKey } from "../lib/auth.js";
import { checkRateLimit } from "../lib/rateLimit.js";
import { acquireContext, releaseContext } from "../lib/browser.js";
import { renderTemplate, getTemplateNames } from "../templates/index.js";
import type { BrowserContext } from "playwright-core";

interface OgBody {
  template: string;
  data: Record<string, any>;
  format?: "png" | "jpeg";
  quality?: number;
}

export async function ogRoute(request: FastifyRequest<{ Body: OgBody }>, reply: FastifyReply) {
  // Auth
  const key = extractApiKey(request.headers.authorization) || (request.headers["x-api-key"] as string);
  if (!validateApiKey(key)) {
    return reply.status(401).send({ error: "Unauthorized" });
  }

  // Rate limit
  const rl = checkRateLimit(key!);
  if (!rl.allowed) {
    return reply.status(429).send({ error: "Rate limit exceeded" });
  }

  const { template, data, format = "png", quality = 90 } = request.body || {};

  if (!template) {
    return reply.status(400).send({
      error: "Missing 'template' field.",
      available: getTemplateNames(),
    });
  }

  if (!data || typeof data !== "object") {
    return reply.status(400).send({ error: "Missing 'data' object." });
  }

  // Render template to HTML
  const html = renderTemplate(template, data);
  if (!html) {
    return reply.status(400).send({
      error: `Unknown template: '${template}'`,
      available: getTemplateNames(),
    });
  }

  // Screenshot at OG Image standard size: 1200x630
  let context: BrowserContext | null = null;
  try {
    context = await acquireContext();
    const page = await context.newPage();
    await page.setViewportSize({ width: 1200, height: 630 });
    await page.setContent(html, { waitUntil: "networkidle", timeout: 15000 });

    const opts: any = { type: format, clip: { x: 0, y: 0, width: 1200, height: 630 } };
    if (format === "jpeg") opts.quality = Math.min(100, Math.max(0, quality));
    const imgBuffer = await page.screenshot(opts);

    const ct = format === "png" ? "image/png" : "image/jpeg";
    return reply
      .header("content-type", ct)
      .header("x-ratelimit-remaining", rl.remaining)
      .header("cache-control", "public, max-age=86400")
      .send(Buffer.from(imgBuffer));
  } catch (e: any) {
    if (e.message?.includes("at capacity")) return reply.status(503).send({ error: e.message });
    return reply.status(500).send({ error: "OG image generation failed", message: e.message });
  } finally {
    if (context) await releaseContext(context);
  }
}

/** List available templates */
export async function ogTemplatesRoute(_request: FastifyRequest, reply: FastifyReply) {
  return reply.send({
    templates: getTemplateNames(),
    size: "1200x630",
    formats: ["png", "jpeg"],
  });
}
