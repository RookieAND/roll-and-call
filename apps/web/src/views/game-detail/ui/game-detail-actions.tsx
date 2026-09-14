import {
  canCoordinate,
  type GameStatus,
  isSessionLocked,
  type ParticipantStatus,
} from "@/entities/game";
import { GameScheduleLink } from "@/features/coordinate-session";
import type { GameDetailData } from "@/shared/server";
import { GameActionZone } from "./game-action-zone";

type Props = {
  game: GameDetailData;
  viewerId: string | null;
  isGm: boolean;
  viewerStatus: ParticipantStatus | null;
  waitlistRank: number | null;
  waitingCount: number;
  status: GameStatus;
};

// 화면 하단에 고정되는 액션 바. GM에게는 조율 현황 패널을, 그 외에는 상태별 액션 존을 보여준다.
// GM의 수정·삭제·참여자 관리는 상단 ⋯ 메뉴(GameGmMenu)로 옮겼다.
export function GameDetailActions({ game, isGm, ...rest }: Props) {
  const canSchedule = canCoordinate({ scheduleMode: game.scheduleMode });

  // 두 존은 상호배타: schedulePanel(GM·미확정)이면 actionZone은 항상 false.
  // 일시 지정형은 confirmedAt이 처음부터 있어도 세션 전까지는 잠기지 않는다(isSessionLocked).
  const locked = isSessionLocked(game);
  const showSchedulePanel = isGm && canSchedule && !locked;
  const showActionZone = locked || !isGm;
  if (!showActionZone && !showSchedulePanel) return null;

  // ponytail: bottom-[58px]는 BottomNav 높이(h-[58px])와 결합. nav 높이 바뀌면 같이 조정.
  return (
    <div className="sticky bottom-[58px] z-10 border-t border-gray-100 bg-surface px-4 py-4">
      {showSchedulePanel ? (
        <GameScheduleLink gameId={game.id} label="일정 조율 현황" className="h-12 w-full text-sm" />
      ) : (
        <GameActionZone game={game} canSchedule={canSchedule} {...rest} />
      )}
    </div>
  );
}
