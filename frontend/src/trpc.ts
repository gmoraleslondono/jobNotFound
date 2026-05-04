import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../backend/appRouter";
import { QueryClient } from "@tanstack/react-query";
import { createTRPCContext } from "@trpc/tanstack-react-query";

export const queryClient = new QueryClient();

const apiBase = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
const apiUrl = apiBase
  ? `${apiBase}/trpc`
  : import.meta.env.DEV
    ? "http://localhost:3000/trpc"
    : "/trpc";

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: apiUrl,
    }),
  ],
});

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();
