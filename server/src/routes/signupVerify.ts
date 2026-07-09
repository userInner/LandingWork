import type { FastifyRequest, FastifyReply } from "fastify";
import crypto from "crypto";
import { getUserByEmail, createUser } from "../lib/db.js";
import { verifyCode } from "../lib/verification.js";

export async function signupVerifyRoute(request: FastifyRequest<{ Body: { email?: string; code?: string } }>, reply: FastifyReply) {
  const email = request.body?.email?.trim().toLowerCase();
  const code = request.body?.code?.trim();

  if (!email || !code) return reply.status(400).send({ error: "Email and code required." });

  const existing = getUserByEmail(email);
  if (existing) return reply.send({ apiKey: existing.apiKey, message: "Welcome back!" });

  const result = verifyCode(email, code);
  if (!result.valid) return reply.status(400).send({ error: result.error });

  const apiKey = `sf_${crypto.randomBytes(16).toString("hex")}`;
  createUser(email, apiKey);

  return reply.send({ apiKey, message: "Email verified! Your API key is ready." });
}
