import { FloatingBar } from "@roll-and-call/ui";

import { ERROR_DISPLAY } from "@/shared/api";
import { ErrorBoundary } from "@/shared/error-boundary";

import { GameActionZone, type GameActionZoneProps } from "./game-action-zone";

export function GameDetailActions(props: GameActionZoneProps) {
  return (
    <FloatingBar.Root>
      <FloatingBar.Content>
        <ErrorBoundary display={ERROR_DISPLAY.toast}>
          <GameActionZone {...props} />
        </ErrorBoundary>
      </FloatingBar.Content>
      <FloatingBar.Spacer />
    </FloatingBar.Root>
  );
}
