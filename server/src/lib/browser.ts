import { chromium, type Browser, type BrowserContext } from "playwright-core";

const MAX_CONCURRENT = parseInt(process.env.MAX_CONCURRENT_BROWSERS || "4", 10);

let browser: Browser | null = null;
let activeContexts = 0;

async function getBrowser(): Promise<Browser> {
  if (!browser || !browser.isConnected()) {
    browser = await chromium.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-first-run",
        "--disable-extensions",
      ],
    });
  }
  return browser;
}

export async function acquireContext(): Promise<BrowserContext> {
  if (activeContexts >= MAX_CONCURRENT) {
    throw new Error(`Server at capacity (${MAX_CONCURRENT} concurrent). Retry shortly.`);
  }
  activeContexts++;
  const b = await getBrowser();
  return await b.newContext({ bypassCSP: true });
}

export async function releaseContext(context: BrowserContext): Promise<void> {
  try { await context.close(); } finally { activeContexts--; }
}
