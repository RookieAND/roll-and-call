"use client";

import { useSyncExternalStore } from "react";

// Tailwind lg와 같은 경계. 768~1023px도 모바일 화면을 쓴다.
const QUERY = "(min-width: 1024px)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

// 서버 렌더는 데스크톱으로 본다. 이 값으로 고르는 모달·시트는 닫힌 채로 그려져 첫 화면이 어긋나지 않는다.
export function useDesktop(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => true,
  );
}
