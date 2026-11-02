import { useSyncExternalStore } from "react";

const DESKTOP_QUERY = "(min-width: 1100px)";

function subscribe(onChange: () => void) {
  const query = matchMedia(DESKTOP_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

// 서버 렌더와 첫 하이드레이션은 모바일로 그린다.
export function useIsDesktop() {
  return useSyncExternalStore(
    subscribe,
    () => matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );
}
