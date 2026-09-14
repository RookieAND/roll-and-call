"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";

// 요청(탭)마다 클라이언트를 하나만 만든다. staleTime은 서버가 준 initialData를 곧바로 다시 받지 않게 한다.
export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 30_000 } } }),
  );
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
