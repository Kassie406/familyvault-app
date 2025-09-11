import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: "12mb" })); // base64 payloads

// 1) Proxy to your AWS API Gateway + Lambda (preferred)
const LAMBDA_URL = process.env.LAMBDA_URL; // e.g. https://abc123.execute-api.us-east-1.amazonaws.com/prod

app.post("/api/inbox/analyze", async (req, res) => {
  try {
    if (!LAMBDA_URL) return res.status(500).json({ error: "Missing LAMBDA_URL secret" });

    // forward JSON as-is
    const r = await fetch(`${LAMBDA_URL}/api/inbox/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });

    const text = await r.text();
    res.status(r.status).set("Content-Type", r.headers.get("content-type") || "application/json").send(text);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Proxy error", message: String(err) });
  }
});

// 2) Static serve (prod) – serves Vite build
if (process.env.NODE_ENV === "production") {
  const dist = path.join(__dirname, "dist");
  app.use(express.static(dist));
  app.get("*", (_, res) => res.sendFile(path.join(dist, "index.html")));
}

const PORT = 3001; // Use a different port to avoid conflicts
app.listen(PORT, "0.0.0.0", () => console.log(`Trustworthy Inbox API Server on http://0.0.0.0:${PORT}`));