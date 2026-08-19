import { Button, Text, VStack } from "@trpg/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import {
  canCoordinate,
  GAME_STATUS,
  type GameStatus,
  PARTICIPANT_STATUS,
  type ParticipantStatus,
} from "@/entities/game";
import type { GameDetailData } from "@/entities/game/api/queries";
import { LoginButton } from "@/features/auth";
import { GameScheduleLink, JoinButton, joinGame, leaveGame } from "@/features/game";
import { formatDateTime } from "@/shared/lib/format";
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
  const scheduleHref = `/games/${game.id}/schedule`;
  const isWaiting = viewerStatus === PARTICIPANT_STATUS.waiting;
  const isConfirmed = viewerStatus === PARTICIPANT_STATUS.confirmed;

  const showSchedulePanel = isGm && canSchedule && !game.confirmedAt;
  const showActionZone = Boolean(game.confirmedAt) || !isGm;
  if (!showActionZone && !showSchedulePanel) return null;

  // ponytail: bottom-[58px]는 BottomNav 높이(h-[58px])와 결합. nav 높이 바뀌면 같이 조정.
  return (
    <div className="sticky bottom-[58px] z-10 border-t border-gray-100 bg-surface px-4 py-4">
      {showActionZone && (
        <>
          {game.confirmedAt ? (
            <VStack gap={3}>
              <StatusNotice tone="success">
                <Text typography="subtitle2" foreground="success" render={<div />}>
                  세션 확정
                </Text>
                <Text
                  typography="heading3"
                  foreground="success"
                  render={<div />}
                  className="mt-0.5"
                >
                  {formatDateTime(game.confirmedAt)}
                </Text>
              </StatusNotice>
              {canSchedule && (
                <GameScheduleLink
                  gameId={game.id}
                  label="일정 조율 보기"
                  className="h-12 w-full text-sm"
                />
              )}
            </VStack>
          ) : isWaiting ? (
            // 8c: 대기자 시점. 대기는 거절이 아니라는 걸 문장으로 못박고,
            // 대기 중에도 할 일(가능 시간 입력)을 준다.
            <VStack gap={3}>
              <StatusNotice tone="muted" className="text-left">
                <Text typography="subtitle2" render={<div />}>
                  정원이 차서 대기로 접수됐습니다
                </Text>
                <Text typography="body3" foreground="muted" render={<p />} className="mt-1.5">
                  앞 순번이 빠지면 자동으로 확정됩니다. 마감까지 순번이 오지 않아도 GM이 대기자를
                  모아 다음 회차를 열 수 있습니다.
                </Text>
                <Text typography="body3" foreground="muted" render={<div />} className="mt-2">
                  대기 {waitlistRank}/{waitingCount} · 마감 {formatDateTime(game.endDate)}
                </Text>
              </StatusNotice>
              {canSchedule && (
                <GameScheduleLink
                  gameId={game.id}
                  label="가능 시간 입력"
                  className="h-12 w-full text-sm"
                />
              )}
              <JoinButton
                gameId={game.id}
                action={leaveGame}
                label="대기 취소"
                variant="outline"
                successMessage="대기를 취소했습니다"
              />
            </VStack>
          ) : status === GAME_STATUS.closed ? (
            <StatusNotice tone="muted">모집이 마감되었습니다</StatusNotice>
          ) : !viewerId ? (
            <VStack gap={3} className="items-center text-center">
              <Text typography="body2" foreground="muted">
                참여하려면 로그인이 필요합니다.
              </Text>
              <LoginButton className="w-full" />
            </VStack>
          ) : isConfirmed ? (
            // 참여 완료 → 주 CTA를 일정 조율로 전환, 참여 취소는 보조로 강등.
            <VStack gap={2}>
              {canSchedule && (
                <Button asChild size="lg" className="w-full gap-1.5">
                  <Link href={scheduleHref}>
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
          ) : (
            <JoinButton
              gameId={game.id}
              action={joinGame}
              label="참여하기"
              successMessage="참여했습니다"
            />
          )}
        </>
      )}

      {showSchedulePanel && (
        <GameScheduleLink gameId={game.id} label="일정 조율 현황" className="h-12 w-full text-sm" />
      )}
    </div>
  );
}
