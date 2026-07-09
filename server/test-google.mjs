import http from "http";
import fs from "fs";

const data = JSON.stringify({
  url: "https://www.google.com",
  format: "png",
  width: 1280,
  height: 800,
});

const options = {
  hostname: "localhost",
  port: 4000,
  path: "/api/v1/screenshot",
  method: "POST",
  headers: {
    Authorization: "Bearer sk_test_your-api-key-here",
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(data),
  },
};

const req = http.request(options, (res) => {
  const chunks = [];
  res.on("data", (chunk) => chunks.push(chunk));
  res.on("end", () => {
    const body = Buffer.concat(chunks);
    console.log("Status:", res.statusCode);
    console.log("Content-Type:", res.headers["content-type"]);
    if (res.statusCode === 200 && res.headers["content-type"]?.includes("image")) {
      const out = "/Users/happyplanet/Documents/projects/LandingWork/snapforge/google_screenshot.png";
      fs.writeFileSync(out, body);
      console.log("SUCCESS! Saved to:", out);
      console.log("Size:", body.length, "bytes");
    } else {
      console.log("Response:", body.toString().slice(0, 500));
    }
  });
});

req.on("error", (e) => console.error("Error:", e.message));
req.write(data);
req.end();
