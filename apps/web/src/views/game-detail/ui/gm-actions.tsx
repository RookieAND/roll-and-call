import { VStack } from "@trpg/ui";

import { ConfirmedSessionNotice } from "@/entities/game";
import { ddayKst } from "@/shared/lib";
import { StatusNotice } from "@/shared/ui";

import { ActionHint } from "./action-hint";
import { ManageGameLink } from "./manage-game-link";

// GM에게도 상세는 읽는 화면이다. 시간 확정 · 참여자 관리 · 세션 준비는 운영 관리 한 곳으로 보낸다.
export function GmActions({
  gameId,
  confirmedAt,
  confirmedCount,
  waitingCount,
  endDate,
  deadlinePassed,
}: {
  gameId: string;
  confirmedAt: Date | null;
  confirmedCount: number;
  waitingCount: number;
  endDate: Date;
  deadlinePassed: boolean;
}) {
  const days = ddayKst(endDate);
  const deadlineText = deadlinePassed
    ? "모집 마감"
    : days === 0
      ? "오늘 마감"
      : `마감까지 ${days}일`;

  return (
    <VStack gap={2}>
      {confirmedAt ? (
        <ConfirmedSessionNotice confirmedAt={confirmedAt} />
      ) : (
        <StatusNotice tone="muted">
          참여자 {confirmedCount}명 · 대기 {waitingCount}명 · {deadlineText}
        </StatusNotice>
      )}
      <ManageGameLink gameId={gameId} />
      <ActionHint>
        {confirmedAt
          ? "확정 뒤에도 같은 자리에서 준비 상황을 봅니다."
          : "운영 관리에서 시간 확정 · 참여자 관리 · 세션 준비를 합니다."}
      </ActionHint>
    </VStack>
  );
}
