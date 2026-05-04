import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import { createServer } from "http";
import { resolve } from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import sirv from "sirv";
import { appRouter } from "./appRouter.ts";

const dist = resolve(fileURLToPath(new URL(".", import.meta.url)), "../frontend/dist");
const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST ?? "0.0.0.0";

const corsOrigins = (process.env.FRONTEND_URL ?? "http://localhost:5173")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const trpc = createHTTPHandler({
  basePath: "/trpc/",
  router: appRouter,
  middleware: cors({
    origin:
      corsOrigins.length === 1 ? corsOrigins[0]! : corsOrigins,
    credentials: true,
  }),
});

const staticFiles = sirv(dist, { single: true });

createServer((req, res) => {
  const path = new URL(req.url ?? "/", "http://localhost").pathname;
  if (path === "/trpc" || path.startsWith("/trpc/")) {
    trpc(req, res);
    return;
  }
  staticFiles(req, res, () => {
    res.statusCode = 404;
    res.end();
  });
}).listen(port, host, () => {
  console.log(`Listening on http://${host}:${port}`);
});
