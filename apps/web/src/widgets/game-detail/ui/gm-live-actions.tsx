import { VStack } from "@roll-and-call/ui";

import { ActionNotice } from "./action-notice";
import { ManageGameLink } from "./manage-game-link";

interface GmLiveActionsProps {
  gameId: string;
  attendanceExpected: boolean;
  attendanceRecorded: boolean;
}

const ATTENDANCE_LINES = ["불참한 참여자가 있으면 운영 관리에서 출석을 입력해 주세요."];
const RECORDED_LINES = ["출석 확인을 마쳤습니다."];

// 출석은 시작 시각부터 입력할 수 있다. 진행 중에는 운영 관리의 출석 확인 줄이 입구다.
export function GmLiveActions({
  gameId,
  attendanceExpected,
  attendanceRecorded,
}: GmLiveActionsProps) {
  if (!attendanceExpected) return <ManageGameLink gameId={gameId} />;

  return (
    <VStack gap="125">
      <ActionNotice
        title="세션이 진행 중입니다"
        lines={attendanceRecorded ? RECORDED_LINES : ATTENDANCE_LINES}
      />
      <ManageGameLink gameId={gameId} />
    </VStack>
  );
}
