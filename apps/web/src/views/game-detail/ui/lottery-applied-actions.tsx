import { VStack } from "@roll-and-call/ui";

import { LEAVE_KIND, LeaveConfirmButton } from "@/features/join-game";
import { formatDateClock } from "@/shared/lib";

import { ActionNotice } from "./action-notice";

interface LotteryAppliedActionsProps {
  gameId: string;
  endDate: Date;
  closed: boolean;
}

// 마감 뒤에는 추첨 대상이 정해져 취소 버튼이 없다(D245).
export function LotteryAppliedActions({ gameId, endDate, closed }: LotteryAppliedActionsProps) {
  const drawLine = closed
    ? "모집이 끝나 곧 추첨합니다."
    : `${formatDateClock(endDate)} 모집이 끝나면 추첨합니다.`;
  const notice = (
    <ActionNotice
      title="참여 신청이 접수되었습니다"
      lines={[drawLine, "결과는 알림 탭으로 알립니다."]}
      colorPalette={closed ? "gray" : "primary"}
    />
  );
  if (closed) return notice;

  return (
    <VStack gap="125">
      {notice}
      <LeaveConfirmButton gameId={gameId} kind={LEAVE_KIND.lottery} size="lg" className="w-full" />
    </VStack>
  );
}
