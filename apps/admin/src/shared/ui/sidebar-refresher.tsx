"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const REFRESH_INTERVAL_MS = 60_000;

// 유저 앱에서 들어오는 인증 신청·룰북 추가 요청은 이 화면의 서버 액션을 거치지 않아 건수가 저절로 갱신되지 않는다.
// 보이는 탭에서만 주기적으로, 탭으로 돌아올 때 한 번 레이아웃을 다시 읽는다.
export function SidebarRefresher() {
  const router = useRouter();
  useEffect(() => {
    let refreshedAt = Date.now();
    const refresh = () => {
      if (document.visibilityState !== "visible") return;
      if (Date.now() - refreshedAt < REFRESH_INTERVAL_MS / 2) return;
      refreshedAt = Date.now();
      router.refresh();
    };
    const timer = setInterval(refresh, REFRESH_INTERVAL_MS);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [router]);
  return null;
}
