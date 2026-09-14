import { canCoordinate } from "@/entities/game";
import { GameActionZone, type GameActionZoneProps } from "./game-action-zone";

// 화면 하단에 고정되는 액션 바. 모든 분기가 상태 안내 → 주 CTA → 보조 액션 한 문법을 쓴다.
export function GameDetailActions(props: Omit<GameActionZoneProps, "canSchedule">) {
  const canSchedule = canCoordinate({ scheduleMode: props.game.scheduleMode });

  // ponytail: bottom-[58px]는 BottomNav 높이(h-[58px])와 결합. nav 높이 바뀌면 같이 조정.
  return (
    <div className="sticky bottom-[58px] z-10 border-t border-gray-200 bg-surface px-4 pt-3.5 pb-4">
      <GameActionZone {...props} canSchedule={canSchedule} />
    </div>
  );
}
