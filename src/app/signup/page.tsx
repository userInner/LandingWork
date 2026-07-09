"use client";

import { useState } from "react";
import Link from "next/link";

type Step = "email" | "verify";

export default function SignupPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Submit email → send verification code
  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/v1/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }

      // If user already exists, go directly to success
      if (data.step === "done") {
        window.location.href = `/signup/success?key=${encodeURIComponent(data.apiKey)}`;
        return;
      }

      // Move to verification step
      setStep("verify");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Step 2: Submit verification code → get API key
  async function handleCodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/v1/signup/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Verification failed.");
        return;
      }

      // Success — redirect
      window.location.href = `/signup/success?key=${encodeURIComponent(data.apiKey)}`;
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Resend code
  async function handleResend() {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/v1/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Could not resend code.");
        return;
      }

      setError(""); // Clear any previous error
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition mb-8"
        >
          &larr; Back to home
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
          <div className="text-center mb-8">
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-emerald-400">Landing</span>Work
            </span>
            <h1 className="text-2xl font-bold mt-4 mb-2">
              {step === "email" ? "Get your free API key" : "Check your email"}
            </h1>
            <p className="text-slate-400 text-sm">
              {step === "email"
                ? "200 screenshots/month. No credit card required."
                : `We sent a 6-digit code to ${email}`}
            </p>
          </div>

          {/* Step 1: Email input */}
          {step === "email" && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
              </div>

              {error && (
                <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 disabled:cursor-not-allowed text-slate-950 font-semibold rounded-lg text-lg transition"
              >
                {loading ? "Sending code..." : "Send Verification Code"}
              </button>
            </form>
          )}

          {/* Step 2: Code verification */}
          {step === "verify" && (
            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Verification code
                </label>
                <input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-center text-2xl tracking-[0.3em] font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  autoFocus
                />
              </div>

              {error && (
                <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 disabled:cursor-not-allowed text-slate-950 font-semibold rounded-lg text-lg transition"
              >
                {loading ? "Verifying..." : "Verify & Get API Key"}
              </button>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => { setStep("email"); setCode(""); setError(""); }}
                  className="text-sm text-slate-400 hover:text-white transition"
                >
                  Change email
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading}
                  className="text-sm text-emerald-400 hover:text-emerald-300 transition disabled:opacity-50"
                >
                  Resend code
                </button>
              </div>
            </form>
          )}

          <p className="mt-6 text-center text-xs text-slate-500">
            By signing up, you agree to our terms of service.
            <br />
            Free tier includes 200 screenshots/month during beta.
          </p>
        </div>
      </div>
    </main>
  );
}
