import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import { App } from "./App.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient, trpcClient, TRPCProvider } from "./trpc.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        <App />
      </TRPCProvider>
    </QueryClientProvider>
  </StrictMode>,
);
