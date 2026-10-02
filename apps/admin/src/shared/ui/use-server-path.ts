"use client";

import { useParams } from "next/navigation";
import { useCallback } from "react";

import { serverPath } from "@/shared/lib";

export function useServerPath() {
  const { server } = useParams<{ server: string }>();
  return useCallback((path: string) => serverPath({ slug: server, path }), [server]);
}
