import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { appRouter } from "./appRouter.ts";
import cors from "cors";

const server = createHTTPServer({
  middleware: cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
  router: appRouter,
});

server.listen(3000);
