import { useSyncExternalStore } from "react";

const QUERY = "(hover: none)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

// 손가락으로 쓰는 기기. hover가 없으니 hover로만 열리는 것은 도달할 수 없다.
export function useHoverNone(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
