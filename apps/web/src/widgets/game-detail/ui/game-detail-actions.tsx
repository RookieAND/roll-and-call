import { Button, Text, VStack } from "@trpg/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import {
  canCoordinate,
  ConfirmedSessionNotice,
  deriveActionView,
  GAME_STATUS,
  type GameStatus,
  PARTICIPANT_STATUS,
  type ParticipantStatus,
  WaitlistNotice,
} from "@/entities/game";
import type { GameDetailData } from "@/entities/game/api/queries";
import { LoginButton } from "@/features/auth";
import { GameScheduleLink, JoinButton, joinGame, leaveGame } from "@/features/game";
import { StatusNotice } from "@/shared/ui/status-notice";

type Props = {
  game: GameDetailData;
  viewerId: string | null;
  isGm: boolean;
  viewerStatus: ParticipantStatus | null;
  waitlistRank: number | null;
  waitingCount: number;
  status: GameStatus;
};

// 상태·권한별 액션 존. GM의 수정·삭제·참여자 관리는 상단 ⋯ 메뉴(GameGmMenu)로 옮겼다.
export function GameDetailActions({
  game,
  viewerId,
  isGm,
  viewerStatus,
  waitlistRank,
  waitingCount,
  status,
}: Props) {
  const canSchedule = canCoordinate({ scheduleMode: game.scheduleMode });

  // 두 존은 상호배타: schedulePanel(GM·미확정)이면 actionZone은 항상 false.
  const showSchedulePanel = isGm && canSchedule && !game.confirmedAt;
  const showActionZone = Boolean(game.confirmedAt) || !isGm;
  if (!showActionZone && !showSchedulePanel) return null;

  // ponytail: bottom-[58px]는 BottomNav 높이(h-[58px])와 결합. nav 높이 바뀌면 같이 조정.
  return (
    <div className="sticky bottom-[58px] z-10 border-t border-gray-100 bg-surface px-4 py-4">
      {showSchedulePanel ? (
        <GameScheduleLink gameId={game.id} label="일정 조율 현황" className="h-12 w-full text-sm" />
      ) : (
        <ActionZone
          game={game}
          viewerId={viewerId}
          viewerStatus={viewerStatus}
          waitlistRank={waitlistRank}
          waitingCount={waitingCount}
          status={status}
          canSchedule={canSchedule}
        />
      )}
    </div>
  );
}

type ActionZoneProps = Pick<
  Props,
  "game" | "viewerId" | "viewerStatus" | "waitlistRank" | "waitingCount" | "status"
> & { canSchedule: boolean };

// actionView 태그별 early-return. 조합(entity 표시 + feature 버튼)이라 widget 레이어에 둔다.
function ActionZone({
  game,
  viewerId,
  viewerStatus,
  waitlistRank,
  waitingCount,
  status,
  canSchedule,
}: ActionZoneProps) {
  const actionView = deriveActionView({
    sessionConfirmed: Boolean(game.confirmedAt),
    isWaiting: viewerStatus === PARTICIPANT_STATUS.waiting,
    isClosed: status === GAME_STATUS.closed,
    isSignedIn: Boolean(viewerId),
    viewerConfirmed: viewerStatus === PARTICIPANT_STATUS.confirmed,
  });

  if (actionView === "confirmed") {
    return (
      <VStack gap={3}>
        <ConfirmedSessionNotice confirmedAt={game.confirmedAt!} />
        {canSchedule && (
          <GameScheduleLink gameId={game.id} label="일정 조율 보기" className="h-12 w-full text-sm" />
        )}
      </VStack>
    );
  }

  if (actionView === "waiting") {
    return (
      <VStack gap={3}>
        <WaitlistNotice rank={waitlistRank} waitingCount={waitingCount} endDate={game.endDate} />
        {canSchedule && (
          <GameScheduleLink gameId={game.id} label="가능 시간 입력" className="h-12 w-full text-sm" />
        )}
        <JoinButton
          gameId={game.id}
          action={leaveGame}
          label="대기 취소"
          variant="outline"
          successMessage="대기를 취소했습니다"
        />
      </VStack>
    );
  }

  if (actionView === "closed") {
    return <StatusNotice tone="muted">모집이 마감되었습니다</StatusNotice>;
  }

  if (actionView === "anon") {
    return (
      <VStack gap={3} className="items-center text-center">
        <Text typography="body2" foreground="muted">
          참여하려면 로그인이 필요합니다.
        </Text>
        <LoginButton className="w-full" />
      </VStack>
    );
  }

  if (actionView === "joined") {
    // 참여 완료 → 주 CTA를 일정 조율로 전환, 참여 취소는 보조로 강등.
    return (
      <VStack gap={2}>
        {canSchedule && (
          <Button asChild size="lg" className="w-full gap-1.5">
            <Link href={`/games/${game.id}/schedule`}>
              일정 조율하기 <ChevronRight size={16} aria-hidden />
            </Link>
          </Button>
        )}
        <JoinButton
          gameId={game.id}
          action={leaveGame}
          label="참여 취소"
          variant="outline"
          successMessage="참여를 취소했습니다"
        />
      </VStack>
    );
  }

  return (
    <JoinButton
      gameId={game.id}
      action={joinGame}
      label="참여하기"
      successMessage="참여했습니다"
    />
  );
}
