"use client";

import { isUndefined } from "es-toolkit";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { ComponentProps } from "react";

import { serverPath } from "@/shared/lib";

type ServerLinkProps = Omit<ComponentProps<typeof Link>, "href"> & { path: string };

// 서버 컴포넌트에서도 slug 없이 서버 화면 링크를 걸 때 쓴다. 서버 밖(루트 404 등)에선 proxy가 기본 서버로 옮긴다.
export function ServerLink({ path, ...props }: ServerLinkProps) {
  const { server } = useParams<{ server?: string }>();
  return <Link href={isUndefined(server) ? path : serverPath({ slug: server, path })} {...props} />;
}
