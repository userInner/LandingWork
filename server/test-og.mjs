import http from "http";
import fs from "fs";

const templates = [
  {
    name: "blog-card",
    data: {
      template: "blog-card",
      data: {
        title: "How I Built a $5K/mo SaaS in One Weekend",
        author: "Alex Chen",
        date: "July 2025",
        domain: "snapforge.dev",
        tag: "Engineering",
      },
    },
    output: "og_blog_card.png",
  },
  {
    name: "minimal",
    data: {
      template: "minimal",
      data: {
        title: "Ship Faster, Worry Less",
        subtitle: "The screenshot API that just works.",
      },
    },
    output: "og_minimal.png",
  },
  {
    name: "product-card",
    data: {
      template: "product-card",
      data: {
        name: "SnapForge",
        description: "Turn any URL or HTML into a pixel-perfect screenshot with one API call.",
        badge: "Beta",
        price: "Free during beta",
      },
    },
    output: "og_product_card.png",
  },
];

async function test(item) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(item.data);
    const options = {
      hostname: "localhost",
      port: 4000,
      path: "/api/v1/og",
      method: "POST",
      headers: {
        Authorization: "Bearer sk_test_your-api-key-here",
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const req = http.request(options, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        const data = Buffer.concat(chunks);
        if (res.statusCode === 200) {
          const outPath = `/Users/happyplanet/Documents/projects/LandingWork/snapforge/${item.output}`;
          fs.writeFileSync(outPath, data);
          console.log(`✅ ${item.name}: ${data.length} bytes → ${item.output}`);
        } else {
          console.log(`❌ ${item.name}: ${res.statusCode} — ${data.toString().slice(0, 200)}`);
        }
        resolve();
      });
    });
    req.on("error", (e) => { console.error(`❌ ${item.name}:`, e.message); resolve(); });
    req.write(body);
    req.end();
  });
}

for (const item of templates) {
  await test(item);
}
console.log("\nDone! Check the project root for og_*.png files.");
