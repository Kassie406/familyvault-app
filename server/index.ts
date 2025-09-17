import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { createServer } from "http";

import authRoutes from "./routes/auth";
import { customAuthRouter } from "./custom-auth";
import { setupVite, serveStatic } from "./vite";

async function createServerAndListen() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());
  app.use(cookieParser());

  // Dev-friendly CORS for the Vite/preview UI
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  // Relax CSP in dev to avoid the manifest/JSON/CSP issues you saw
  if (process.env.NODE_ENV === "production") {
    app.use(
      helmet({
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            "default-src": ["'self'"],
            "img-src": ["'self'", "data:", "blob:"],
            "script-src": ["'self'"],
            "style-src": ["'self'", "'unsafe-inline'"],
            "connect-src": ["'self'"],
          },
        },
      })
    );
  } else {
    app.use(helmet({ contentSecurityPolicy: false }));
  }

  app.get("/health", (_, res) => res.json({ ok: true }));

  app.use("/api/auth", authRoutes);
  app.use(customAuthRouter); // Add the /login routes

  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

const port = Number(process.env.PORT || 5050);
server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
}

createServerAndListen();
