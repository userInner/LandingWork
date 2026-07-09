import type { FastifyRequest, FastifyReply } from "fastify";
import { getUserByEmail } from "../lib/db.js";
import { createVerificationCode, canSendCode } from "../lib/verification.js";
import { sendVerificationEmail } from "../lib/email.js";

export async function signupRoute(request: FastifyRequest<{ Body: { email?: string } }>, reply: FastifyReply) {
  const email = request.body?.email?.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return reply.status(400).send({ error: "Invalid email." });
  }

  const existing = getUserByEmail(email);
  if (existing) {
    return reply.send({ step: "done", apiKey: existing.apiKey, message: "Welcome back!" });
  }

  if (!canSendCode(email)) {
    return reply.status(429).send({ error: "Wait 60s before requesting a new code." });
  }

  const code = createVerificationCode(email);
  const result = await sendVerificationEmail(email, code);
  if (!result.success) {
    return reply.status(500).send({ error: "Could not send email.", detail: result.error });
  }

  return reply.send({ step: "verify", message: "Verification code sent!" });
}
