import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { screenshotRoute } from "./routes/screenshot.js";
import { signupRoute } from "./routes/signup.js";
import { signupVerifyRoute } from "./routes/signupVerify.js";
import { ogRoute, ogTemplatesRoute } from "./routes/og.js";

const app = Fastify({ logger: true });

// CORS — allow frontend origin
await app.register(cors, {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: ["GET", "POST"],
});

// Health check
app.get("/health", async () => ({ status: "ok", timestamp: new Date().toISOString() }));

// API routes
app.post("/api/v1/screenshot", screenshotRoute);
app.post("/api/v1/signup", signupRoute);
app.post("/api/v1/signup/verify", signupVerifyRoute);
app.post("/api/v1/og", ogRoute);
app.get("/api/v1/og/templates", ogTemplatesRoute);

// Start
const port = parseInt(process.env.PORT || "4000", 10);
app.listen({ port, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 LandingWork API running at ${address}`);
});
