"use client";

import { serverPath } from "@roll-and-call/app-kit/lib";
import { useParams } from "next/navigation";

// 클라이언트 컴포넌트용. 지금 주소의 [server] 값으로 서버 화면 주소를 만든다.
export function useServerPath() {
  const { server } = useParams<{ server: string }>();
  return (path: string) => serverPath({ slug: server, path });
}
