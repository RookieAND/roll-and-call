import { ServerLink as BaseServerLink } from "@roll-and-call/app-kit/navigation";
import type { ComponentProps } from "react";

// 목록 행 링크가 한꺼번에 프리페치되면 요청마다 서버 읽기가 몰려 커넥션 풀 앞에 줄이 쌓인다(2026-10-02 타임아웃).
export function ServerLink({ prefetch = false, ...props }: ComponentProps<typeof BaseServerLink>) {
  return <BaseServerLink prefetch={prefetch} {...props} />;
}
