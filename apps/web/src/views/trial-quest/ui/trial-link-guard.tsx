"use client";

import { toast } from "@roll-and-call/ui";
import { useParams } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

interface TrialLinkGuardProps<Screen> {
  // 실제 컴포넌트가 만든 서버 안 주소(/games/…)를 체험 화면으로 옮긴다. 모르는 주소는 null이다.
  resolve: (path: string) => Screen | null;
  onNavigate: (screen: Screen) => void;
  // 체험 화면이 아닌 곳으로 가는 링크를 눌렀을 때. 없으면 안내 토스트만 띄운다.
  onBlocked?: () => void;
  children: ReactNode;
}

const BLOCKED_MESSAGE = "체험에서는 여기까지 볼 수 있습니다";

// 체험 화면 안의 링크는 체험 화면 사이에서만 움직인다. 그 밖은 막는다.
export function TrialLinkGuard<Screen>({
  resolve,
  onNavigate,
  onBlocked,
  children,
}: TrialLinkGuardProps<Screen>) {
  const { server } = useParams<{ server: string }>();

  function guard(event: MouseEvent<HTMLDivElement>) {
    if (!(event.target instanceof Element)) return;
    const anchor = event.target.closest("a[href]");
    if (!anchor || anchor.hasAttribute("data-trial-exit")) return;
    event.preventDefault();
    event.stopPropagation();
    const href = anchor.getAttribute("href") ?? "";
    const path = href.startsWith(`/${server}`) ? href.slice(server.length + 1) || "/" : null;
    const screen = path ? resolve(path) : null;
    if (screen) onNavigate(screen);
    else if (onBlocked) onBlocked();
    else toast.info(BLOCKED_MESSAGE);
  }

  return <div onClickCapture={guard}>{children}</div>;
}
