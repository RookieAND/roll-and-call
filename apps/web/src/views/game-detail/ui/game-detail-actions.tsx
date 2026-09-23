import { FloatingBar } from "@roll-and-call/ui";

import { canCoordinate } from "@/entities/game";
import { ERROR_DISPLAY } from "@/shared/api";
import { ErrorBoundary } from "@/shared/error-boundary";

import { GameActionZone, type GameActionZoneProps } from "./game-action-zone";

export function GameDetailActions(props: Omit<GameActionZoneProps, "canSchedule">) {
  const canSchedule = canCoordinate({ scheduleMode: props.game.scheduleMode });

  return (
    <FloatingBar.Root>
      <FloatingBar.Content>
        <ErrorBoundary display={ERROR_DISPLAY.toast}>
          <GameActionZone {...props} canSchedule={canSchedule} />
        </ErrorBoundary>
      </FloatingBar.Content>
      <FloatingBar.Spacer />
    </FloatingBar.Root>
  );
}
