"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

import { useServerPath } from "./use-server-path";

type ServerLinkProps = Omit<ComponentProps<typeof Link>, "href"> & { path: string };

// 서버 화면 안 경로("/users/1")에 지금 서버의 slug를 붙여 링크를 건다. 서버 컴포넌트에서도 쓴다.
export function ServerLink({ path, ...props }: ServerLinkProps) {
  const toServerPath = useServerPath();
  return <Link href={toServerPath(path)} {...props} />;
}
