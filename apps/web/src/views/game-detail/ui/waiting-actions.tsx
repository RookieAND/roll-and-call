import { VStack } from "@trpg/ui";

import { LeaveGameButton } from "@/features/join-game";

import { ACTION_PRIMARY_CLASS } from "./action-class-names";
import { ActionNotice } from "./action-notice";

interface WaitingActionsProps {
  gameId: string;
  waitlistRank: number | null;
  pendingDraw: boolean;
}

// 추첨제는 뽑기 전까지 순번이 없다 — 숫자 대신 왜 아직 순번이 없는지 말한다.
export function WaitingActions({ gameId, waitlistRank, pendingDraw }: WaitingActionsProps) {
  const title = pendingDraw
    ? "아직 GM이 추첨을 진행하지 않았습니다"
    : waitlistRank === null
      ? "대기로 접수됐습니다"
      : `현재 대기 ${waitlistRank}번으로 등록되었습니다`;

  const note = pendingDraw
    ? "추첨이 끝나면 결과를 알립니다."
    : "참여 인원의 공백이 생기면 GM이 순서대로 확정합니다.";

  return (
    <VStack gap="125">
      <ActionNotice title={title}>{note}</ActionNotice>
      <LeaveGameButton gameId={gameId} className={ACTION_PRIMARY_CLASS}>
        대기 취소
      </LeaveGameButton>
    </VStack>
  );
}
