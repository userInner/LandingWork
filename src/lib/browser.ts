import { chromium, type Browser, type BrowserContext } from "playwright-core";

const MAX_CONCURRENT = parseInt(process.env.MAX_CONCURRENT_BROWSERS || "4", 10);

let browser: Browser | null = null;
let activeContexts = 0;

/**
 * Get or launch a shared browser instance.
 * Reuses a single Chromium process across requests for efficiency.
 */
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
        "--no-zygote",
        "--single-process",
        "--disable-extensions",
      ],
    });
  }
  return browser;
}

/**
 * Acquire a browser context with concurrency control.
 * Throws if max concurrent limit is reached.
 */
export async function acquireContext(): Promise<BrowserContext> {
  if (activeContexts >= MAX_CONCURRENT) {
    throw new Error(
      `Server is at capacity (${MAX_CONCURRENT} concurrent requests). Please retry shortly.`
    );
  }

  activeContexts++;
  const b = await getBrowser();
  const context = await b.newContext({
    bypassCSP: true,
  });
  return context;
}

/**
 * Release a browser context back to the pool.
 */
export async function releaseContext(context: BrowserContext): Promise<void> {
  try {
    await context.close();
  } finally {
    activeContexts--;
  }
}

/**
 * Gracefully shut down the browser (for cleanup on server stop).
 */
export async function closeBrowser(): Promise<void> {
  if (browser) {
    await browser.close();
    browser = null;
  }
}
