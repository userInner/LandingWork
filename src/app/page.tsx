import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight">
            <span className="text-emerald-400">Landing</span>Work
          </span>
          <div className="flex items-center gap-6">
            <Link href="#features" className="text-sm text-slate-400 hover:text-white transition">
              Features
            </Link>
            <Link href="#pricing" className="text-sm text-slate-400 hover:text-white transition">
              Pricing
            </Link>
            <Link href="#docs" className="text-sm text-slate-400 hover:text-white transition">
              Docs
            </Link>
            <Link
              href="/signup"
              className="text-sm px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium rounded-lg transition"
            >
              Get Free API Key
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-3 py-1 mb-6 text-xs font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full">
            Simple. Fast. Reliable.
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Turn any URL or HTML into a{" "}
            <span className="text-emerald-400">pixel-perfect screenshot</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            One API call. Get back PNG, JPEG, or PDF. No browser infrastructure to manage.
            No memory leaks to debug. Just screenshots that work.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg text-lg transition"
            >
              Get Free API Key — 200 screenshots/mo
            </Link>
            <Link
              href="#docs"
              className="px-8 py-3 border border-slate-700 hover:border-slate-500 text-slate-300 font-medium rounded-lg text-lg transition"
            >
              View Docs
            </Link>
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800">
              <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
              <span className="ml-3 text-xs text-slate-500">cURL</span>
            </div>
            <pre className="p-6 text-sm text-slate-300 overflow-x-auto">
              <code>{`curl -X POST https://api.landingwork.dev/v1/screenshot \\
  -H "Authorization: Bearer sk_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://github.com",
    "format": "png",
    "width": 1280,
    "height": 720,
    "fullPage": false
  }' \\
  --output screenshot.png`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Everything you need. Nothing you don&apos;t.
          </h2>
          <p className="text-slate-400 text-center mb-16 max-w-xl mx-auto">
            Built for developers who want screenshots without the headache of managing Puppeteer clusters.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🌐"
              title="URL or HTML Input"
              description="Pass any public URL or raw HTML string. We render it in a real Chromium browser and capture the result."
            />
            <FeatureCard
              icon="📐"
              title="Custom Viewports"
              description="Set exact width, height, and device scale factor. Simulate mobile, tablet, or desktop screens."
            />
            <FeatureCard
              icon="🖼️"
              title="PNG, JPEG, or PDF"
              description="Choose your output format. Control JPEG quality. Get full-page scrolling captures or viewport-only."
            />
            <FeatureCard
              icon="🌙"
              title="Dark Mode"
              description="Render pages in dark color scheme. Perfect for generating OG images that match your brand."
            />
            <FeatureCard
              icon="⏱️"
              title="Smart Waiting"
              description="Wait for specific selectors or add custom delays. Capture dynamic content after JavaScript finishes rendering."
            />
            <FeatureCard
              icon="⚡"
              title="Fast & Reliable"
              description="Managed browser pool with concurrency limits. No cold starts, no memory leaks, no timeouts."
            />
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">
            Built for real use cases
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <UseCaseCard
              title="OG Image Generation"
              description="Generate dynamic social sharing cards for every blog post, product page, or user profile. Pass your HTML template, get back a perfect 1200x630 PNG."
              tag="Most Popular"
            />
            <UseCaseCard
              title="Invoice & Report PDFs"
              description="Design invoices and reports with HTML/CSS, then convert them to pixel-perfect PDFs. No LaTeX, no wkhtmltopdf headaches."
              tag="B2B"
            />
            <UseCaseCard
              title="Website Monitoring"
              description="Capture periodic screenshots of competitor sites or your own pages. Track visual changes over time for QA and compliance."
              tag="SEO & QA"
            />
            <UseCaseCard
              title="Visual Regression Testing"
              description="Integrate into your CI/CD pipeline. Capture screenshots before and after deployments to catch unintended UI changes."
              tag="DevOps"
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 border-t border-slate-800">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-block px-3 py-1 mb-6 text-xs font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full">
            Beta
          </div>
          <h2 className="text-3xl font-bold mb-4">Free during beta</h2>
          <p className="text-slate-400 mb-12">
            We&apos;re in early access. Get full access for free while we refine the product.
            No credit card required. Ever.
          </p>

          <div className="rounded-2xl border border-emerald-500/30 bg-slate-900 ring-1 ring-emerald-500/10 p-8 max-w-sm mx-auto">
            <h3 className="text-xl font-semibold mb-2">Free Beta</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-slate-400"> /forever</span>
            </div>
            <ul className="space-y-3 mb-8 text-left">
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <span className="text-emerald-400">&#10003;</span>
                200 screenshots/month
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <span className="text-emerald-400">&#10003;</span>
                All formats (PNG, JPEG, PDF)
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <span className="text-emerald-400">&#10003;</span>
                Custom viewports & dark mode
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <span className="text-emerald-400">&#10003;</span>
                Full-page capture
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <span className="text-emerald-400">&#10003;</span>
                Smart wait strategies
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <span className="text-emerald-400">&#10003;</span>
                No credit card required
              </li>
            </ul>
            <Link
              href="/signup"
              className="block w-full text-center py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg transition"
            >
              Get Free API Key
            </Link>
          </div>
        </div>
      </section>

      {/* API Docs Preview */}
      <section id="docs" className="py-20 px-6 border-t border-slate-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Dead-simple API</h2>
          <p className="text-slate-400 text-center mb-12">
            One endpoint. JSON in, image out. Here&apos;s everything you need to know.
          </p>

          <div className="space-y-8">
            {/* Endpoint */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <h3 className="text-lg font-semibold mb-2">Endpoint</h3>
              <code className="text-emerald-400 text-sm">
                POST /api/v1/screenshot
              </code>
            </div>

            {/* Headers */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <h3 className="text-lg font-semibold mb-4">Headers</h3>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-slate-800">
                  <tr>
                    <td className="py-2 text-slate-400 w-48">Authorization</td>
                    <td className="py-2">
                      <code className="text-emerald-400">Bearer sk_your_key</code>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-400">Content-Type</td>
                    <td className="py-2">
                      <code className="text-emerald-400">application/json</code>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Parameters */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <h3 className="text-lg font-semibold mb-4">Parameters</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-slate-800">
                    <th className="py-2 text-slate-400 font-medium">Param</th>
                    <th className="py-2 text-slate-400 font-medium">Type</th>
                    <th className="py-2 text-slate-400 font-medium">Default</th>
                    <th className="py-2 text-slate-400 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <ParamRow name="url" type="string" def="—" desc="URL to capture" />
                  <ParamRow name="html" type="string" def="—" desc="Raw HTML to render" />
                  <ParamRow name="format" type="string" def="png" desc="png, jpeg, or pdf" />
                  <ParamRow name="width" type="number" def="1280" desc="Viewport width (100–3840)" />
                  <ParamRow name="height" type="number" def="720" desc="Viewport height (100–2160)" />
                  <ParamRow name="fullPage" type="boolean" def="false" desc="Capture full scrollable page" />
                  <ParamRow name="quality" type="number" def="80" desc="JPEG quality (0–100)" />
                  <ParamRow name="deviceScaleFactor" type="number" def="1" desc="Device pixel ratio (1–3)" />
                  <ParamRow name="waitAfterLoad" type="number" def="0" desc="Ms to wait after load (max 10000)" />
                  <ParamRow name="waitForSelector" type="string" def="—" desc="CSS selector to wait for" />
                  <ParamRow name="darkMode" type="boolean" def="false" desc="Enable dark color scheme" />
                </tbody>
              </table>
            </div>

            {/* Response */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <h3 className="text-lg font-semibold mb-2">Response</h3>
              <p className="text-slate-400 text-sm mb-4">
                Returns the image binary directly with the appropriate Content-Type header.
                Rate limit info is included in response headers.
              </p>
              <div className="text-sm text-slate-400">
                <code>X-RateLimit-Limit</code> · <code>X-RateLimit-Remaining</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-slate-500">
            &copy; 2025 LandingWork. Built for developers, by a developer.
          </span>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="mailto:hello@landingwork.dev" className="hover:text-white transition">
              Contact
            </a>
            <a href="#" className="hover:text-white transition">
              Twitter
            </a>
            <a href="#" className="hover:text-white transition">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ---------- Components ---------- */

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function UseCaseCard({
  title,
  description,
  tag,
}: {
  title: string;
  description: string;
  tag: string;
}) {
  return (
    <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50">
      <span className="inline-block px-2 py-0.5 text-xs font-medium text-emerald-400 bg-emerald-400/10 rounded mb-3">
        {tag}
      </span>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function ParamRow({
  name,
  type,
  def,
  desc,
}: {
  name: string;
  type: string;
  def: string;
  desc: string;
}) {
  return (
    <tr>
      <td className="py-2">
        <code className="text-emerald-400">{name}</code>
      </td>
      <td className="py-2 text-slate-400">{type}</td>
      <td className="py-2 text-slate-500">{def}</td>
      <td className="py-2 text-slate-300">{desc}</td>
    </tr>
  );
}
