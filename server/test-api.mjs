import http from "http";
import fs from "fs";

const data = JSON.stringify({
  html: '<h1 style="padding:40px;font-size:48px;color:#10b981;">SnapForge Works!</h1>',
  width: 800,
  height: 400,
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
      fs.writeFileSync("/tmp/snapforge_test.png", body);
      console.log("SUCCESS! Screenshot saved to /tmp/snapforge_test.png");
      console.log("Size:", body.length, "bytes");
    } else {
      console.log("Response:", body.toString().slice(0, 500));
    }
  });
});

req.on("error", (e) => console.error("Request error:", e.message));
req.write(data);
req.end();
