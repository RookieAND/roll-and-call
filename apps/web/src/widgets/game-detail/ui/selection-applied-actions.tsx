import { VStack } from "@roll-and-call/ui";

import { LEAVE_KIND, LeaveConfirmButton } from "@/features/join-game";
import { formatDateClock } from "@/shared/lib";

import { ActionNotice } from "./action-notice";

interface SelectionAppliedActionsProps {
  gameId: string;
  endDate: Date;
  closed: boolean;
}

// 마감 뒤에는 신청 취소 버튼이 없다(D245).
export function SelectionAppliedActions({ gameId, endDate, closed }: SelectionAppliedActionsProps) {
  if (closed) {
    return (
      <ActionNotice
        title="모집이 끝나 GM이 선발하고 있습니다."
        lines={["결과는 알림 탭으로 알립니다."]}
        colorPalette="gray"
      />
    );
  }
  return (
    <VStack gap="125">
      <ActionNotice
        title="참여 신청이 접수되었습니다"
        lines={[
          `${formatDateClock(endDate)} 모집이 끝나면 GM이 선발합니다.`,
          "결과는 알림 탭으로 알립니다.",
        ]}
        colorPalette="primary"
      />
      <LeaveConfirmButton gameId={gameId} kind={LEAVE_KIND.lottery} size="lg" className="w-full" />
    </VStack>
  );
}
