"use client";

import { isUndefined } from "es-toolkit";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { ComponentProps } from "react";

import { serverPath } from "../lib/server-path";

type ServerLinkProps = Omit<ComponentProps<typeof Link>, "href"> & { path: string };

// 서버 컴포넌트에서도 slug 없이 서버 화면 링크를 걸 때 쓴다. 서버 밖(루트 404 등)에선 path 그대로 걸어 proxy가 옮기게 한다.
// 화면에 보이기만 해도 서버 함수가 도는 뷰포트 프리패치는 끈다(Active CPU). 필요한 링크만 prefetch로 켠다.
export function ServerLink({ path, ...props }: ServerLinkProps) {
  const { server } = useParams<{ server?: string }>();
  return (
    <Link
      href={isUndefined(server) ? path : serverPath({ slug: server, path })}
      prefetch={false}
      {...props}
    />
  );
}
