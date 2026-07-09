"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const apiKey = searchParams.get("key") || "";

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-lg">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center">
          {/* Success icon */}
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <span className="text-3xl">&#10003;</span>
          </div>

          <h1 className="text-2xl font-bold mb-2">You&apos;re all set!</h1>
          <p className="text-slate-400 mb-8">
            Here&apos;s your API key. Keep it safe — treat it like a password.
          </p>

          {/* API Key display */}
          <div className="relative mb-6">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 font-mono text-sm text-emerald-400 break-all select-all">
              {apiKey}
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(apiKey)}
              className="absolute top-2 right-2 px-3 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded transition"
              aria-label="Copy API key to clipboard"
            >
              Copy
            </button>
          </div>

          {/* Quick start */}
          <div className="text-left rounded-xl border border-slate-800 bg-slate-950 p-6 mb-8">
            <h2 className="text-sm font-semibold text-slate-300 mb-3">
              Quick start — try it now:
            </h2>
            <pre className="text-xs text-slate-400 overflow-x-auto whitespace-pre-wrap">
              <code>{`curl -X POST https://your-domain.com/api/v1/screenshot \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://github.com"}' \\
  --output screenshot.png`}</code>
            </pre>
          </div>

          <div className="space-y-3">
            <Link
              href="/#docs"
              className="block w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg transition"
            >
              View Full Docs
            </Link>
            <Link
              href="/"
              className="block w-full py-3 border border-slate-700 hover:border-slate-500 text-slate-300 font-medium rounded-lg transition"
            >
              Back to Home
            </Link>
          </div>

          <p className="mt-6 text-xs text-slate-500">
            Free tier: 200 screenshots/month during beta. No limits on format or resolution.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}
