import { canCoordinate } from "@/entities/game";
import { ERROR_DISPLAY } from "@/shared/api";
import { ErrorBoundary } from "@/shared/error-boundary";

import { GameActionZone, type GameActionZoneProps } from "./game-action-zone";

export function GameDetailActions(props: Omit<GameActionZoneProps, "canSchedule">) {
  const canSchedule = canCoordinate({ scheduleMode: props.game.scheduleMode });

  // ponytail: bottom-[58px]는 BottomNav 높이(h-[58px])와 결합. nav 높이 바뀌면 같이 조정.
  return (
    <div className="sticky bottom-[58px] z-10 border-t border-gray-200 bg-surface px-4 pt-3.5 pb-4">
      <ErrorBoundary display={ERROR_DISPLAY.toast}>
        <GameActionZone {...props} canSchedule={canSchedule} />
      </ErrorBoundary>
    </div>
  );
}
