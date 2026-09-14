import { Button, Text, VStack } from "@trpg/ui";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ConfirmedSessionNotice,
  GAME_STATUS,
  type GameStatus,
  isDeadlinePassed,
  isSessionLocked,
  PARTICIPANT_STATUS,
  type ParticipantStatus,
} from "@/entities/game";
import { LoginButton } from "@/features/auth";
import { GameScheduleLink } from "@/features/coordinate-session";
import { JoinGameButton, LeaveGameButton } from "@/features/join-game";
import { formatDate } from "@/shared/lib";
import type { GameDetailData } from "@/shared/server";
import { StatusNotice } from "@/shared/ui";
import { deriveActionView } from "../model/derive-action-view";

export type GameActionZoneProps = {
  game: GameDetailData;
  viewerId: string | null;
  isGm: boolean;
  viewerStatus: ParticipantStatus | null;
  waitlistRank: number | null;
  waitingCount: number;
  confirmedCount: number;
  // 확정 참여자 중 가능 시간을 낸 사람 수 / 뷰어가 냈는지
  respondedConfirmed: number;
  viewerResponded: boolean;
  status: GameStatus;
  // coordinate 모드라 일정 조율 화면이 존재하는가
  canSchedule: boolean;
};

const PRIMARY = "h-[50px] w-full rounded-xl text-[15px] font-bold";
const SECONDARY = "h-11 w-full";

// 주 CTA 아래 한 줄: 다음에 무슨 일이 생기는지 미리 알린다.
function Hint({ children }: { children: ReactNode }) {
  return (
    <Text typography="body4" foreground="hint" render={<p />} className="text-center">
      {children}
    </Text>
  );
}

// 한 줄에 버튼 둘이면 반반.
function Pair({ children }: { children: ReactNode }) {
  return <div className="flex gap-2 [&>*]:flex-1">{children}</div>;
}

// actionView 태그별 early-return. 조합(entity 표시 + feature 버튼).
// 조율 화면으로 가는 버튼은 라벨 "일정 조율", 모양 tinted 하나로 고정한다.
export function GameActionZone({
  game,
  viewerId,
  isGm,
  viewerStatus,
  waitlistRank,
  waitingCount,
  confirmedCount,
  respondedConfirmed,
  viewerResponded,
  status,
  canSchedule,
}: GameActionZoneProps) {
  const isClosed = status === GAME_STATUS.closed || status === GAME_STATUS.full;
  const actionView = deriveActionView({
    // 일시 지정형은 등록 때부터 confirmedAt이 있지만 모집 중이면 참여하기를 보여야 한다.
    sessionConfirmed: isSessionLocked(game),
    isGm,
    isCoordinate: canSchedule,
    deadlinePassed: isDeadlinePassed(game.endDate),
    isWaiting: viewerStatus === PARTICIPANT_STATUS.waiting,
    // 기한 경과, 또는 대기 신청을 끈 게임의 정원 충족(full). 대기 받는 정원 충족(confirmed)은 마감이 아니다.
    isClosed,
    isSignedIn: Boolean(viewerId),
    viewerConfirmed: viewerStatus === PARTICIPANT_STATUS.confirmed,
  });

  // 정원 충족이어도 신청은 받는다(초과분은 대기).
  const isFull = status === GAME_STATUS.confirmed;
  const expired = status === GAME_STATUS.closed;
  // leaveGame과 같은 규칙: 확정자는 정원 충족·기한 경과 후 자가 취소 불가.
  const canLeave = !isFull && !isClosed;

  const scheduleLink = (className: string) => (
    <GameScheduleLink gameId={game.id} label="일정 조율" className={className} />
  );
  const manageLink = (
    <Button asChild className={PRIMARY}>
      <Link href={`/games/${game.id}/participants`}>참여자 관리</Link>
    </Button>
  );

  switch (actionView) {
    case "confirmed":
      return (
        <VStack gap={3}>
          <ConfirmedSessionNotice confirmedAt={game.confirmedAt!} />
          {canSchedule && scheduleLink(SECONDARY)}
        </VStack>
      );

    case "confirmed-waiting":
      return (
        <VStack gap={3}>
          <ConfirmedSessionNotice confirmedAt={game.confirmedAt!} />
          <Hint>
            대기 {waitlistRank}/{waitingCount} — 이번 회차는 자리가 나지 않습니다.
          </Hint>
          <LeaveGameButton gameId={game.id} className={SECONDARY}>
            대기 취소
          </LeaveGameButton>
        </VStack>
      );

    case "gm-coordinate":
      return (
        <VStack gap={2}>
          {manageLink}
          {scheduleLink(SECONDARY)}
          <Hint>
            응답 {respondedConfirmed}/{confirmedCount} · 겹치는 시간에서 확정할 수 있습니다.
          </Hint>
        </VStack>
      );

    case "gm-fixed":
      return (
        <VStack gap={2}>
          {manageLink}
          <Hint>일시 지정 글이라 일정 조율은 없습니다.</Hint>
        </VStack>
      );

    case "gm-confirm":
      // 기한이 지나면 GM이 할 일은 하나: 지금 명단으로 세션 시간을 확정한다.
      return (
        <VStack gap={3}>
          <StatusNotice tone="muted">
            모집 기한이 지났습니다. 지금 명단으로 세션 시간을 확정하세요.
          </StatusNotice>
          <Button asChild className={PRIMARY}>
            <Link href={`/games/${game.id}/schedule`}>세션 시간 확정하기</Link>
          </Button>
        </VStack>
      );

    case "waiting":
      // 순번·마감 등 대기 상세는 참여자 아래 대기 섹션이 맡는다. 액션 바에는 한 줄만.
      return canSchedule ? (
        <Pair>
          {scheduleLink(SECONDARY)}
          <LeaveGameButton gameId={game.id} className={SECONDARY}>
            대기 취소
          </LeaveGameButton>
        </Pair>
      ) : (
        <LeaveGameButton gameId={game.id} className={SECONDARY}>
          대기 취소
        </LeaveGameButton>
      );

    case "joined": {
      const leaveLockedMessage = expired
        ? "참여가 확정되었습니다 · 모집이 마감되어 취소는 GM에게 문의해야 합니다"
        : "참여가 확정되었습니다 · 정원이 차서 취소는 GM에게 문의해야 합니다";
      const needsResponse = canSchedule && !viewerResponded;
      return (
        <VStack gap={2}>
          {!canLeave && <StatusNotice tone="muted">{leaveLockedMessage}</StatusNotice>}
          {needsResponse && <Hint>아직 가능 시간을 내지 않았습니다.</Hint>}
          {canSchedule && scheduleLink(PRIMARY)}
          {canLeave && (
            <LeaveGameButton gameId={game.id} className={SECONDARY}>
              참여 취소
            </LeaveGameButton>
          )}
        </VStack>
      );
    }

    case "closed": {
      // "마감"은 기한 경과 한 뜻. 대기를 끈 게임의 정원 충족은 "정원이 차서"라고 쓴다.
      const closedMessage = expired
        ? `${formatDate(game.endDate)}에 모집이 마감되었습니다`
        : "정원이 차서 신청을 받지 않습니다";
      return (
        <VStack gap={3}>
          <StatusNotice tone="muted">{closedMessage}</StatusNotice>
          {/* 막다른 길에 다음 행동을 붙인다. */}
          <Button asChild variant="outline" className={SECONDARY}>
            <Link href="/games">비슷한 구인 보기</Link>
          </Button>
        </VStack>
      );
    }

    case "anon": {
      const anonMessage = isFull
        ? "정원이 찼지만 대기 신청은 가능합니다. 로그인 후 신청하세요."
        : "참여하려면 로그인이 필요합니다.";
      // 로그인 후 이 구인글로 돌아온다(LoginButton 기본 next = 현재 경로).
      return (
        <VStack gap={2}>
          <Hint>{anonMessage}</Hint>
          <LoginButton className={PRIMARY} />
        </VStack>
      );
    }

    case "joinable": {
      const joinLabel = isFull ? "대기 신청하기" : "참여하기";
      // 대기 신청은 결과(몇 번째 대기인지)를 미리 알린다.
      const joinHint = isFull
        ? `지금 신청하면 대기 ${waitingCount + 1}번입니다. 자리가 나면 순서대로 확정됩니다.`
        : canSchedule
          ? "참여하면 가능한 시간을 입력하게 됩니다."
          : null;
      return (
        <VStack gap={2}>
          <JoinGameButton gameId={game.id} className={PRIMARY}>
            {joinLabel}
          </JoinGameButton>
          {joinHint && <Hint>{joinHint}</Hint>}
        </VStack>
      );
    }
  }
}
