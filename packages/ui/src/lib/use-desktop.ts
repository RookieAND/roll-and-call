"use client";

import { useSyncExternalStore } from "react";

// 웹 앱 globals.css의 --breakpoint-desktop(1100px)과 같은 값이다.
const DESKTOP_QUERY = "(min-width: 1100px)";

const subscribe = (notify: () => void) => {
  const query = window.matchMedia(DESKTOP_QUERY);
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};

// 마크업이 폭에 따라 정말 달라져야 하는 곳(토스트 위치처럼 JS가 받는 값)에서만 쓴다. 서버 렌더는 모바일로 본다.
export function useDesktop() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );
}
