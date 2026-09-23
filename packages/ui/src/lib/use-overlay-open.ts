import { useSyncExternalStore } from "react";

import { overlayStore } from "./overlay-store";

export function useOverlayOpen(): boolean {
  return (
    useSyncExternalStore(
      overlayStore.subscribe,
      overlayStore.getSnapshot,
      overlayStore.getServerSnapshot,
    ) > 0
  );
}
