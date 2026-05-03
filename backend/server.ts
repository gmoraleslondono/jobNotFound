import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { appRouter } from "./appRouter.ts";
import cors from "cors";

const port = Number(process.env.PORT) || 3000;

const corsOrigins = (process.env.FRONTEND_URL ?? "http://localhost:5173")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const server = createHTTPServer({
  middleware: cors({
    origin:
      corsOrigins.length === 1 ? corsOrigins[0]! : corsOrigins,
    credentials: true,
  }),
  router: appRouter,
});

server.listen(port);
