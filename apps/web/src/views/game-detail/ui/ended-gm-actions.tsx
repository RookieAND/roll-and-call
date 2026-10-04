import { Button, VStack } from "@roll-and-call/ui";

import { ServerLink } from "@/shared/ui";

import { ActionNotice } from "./action-notice";
import { ManageGameLink } from "./manage-game-link";

interface EndedGmActionsProps {
  gameId: string;
  attendanceDue: boolean;
  attendanceRecorded: boolean;
}

export function EndedGmActions({ gameId, attendanceDue, attendanceRecorded }: EndedGmActionsProps) {
  const attendancePath = `/games/${gameId}/attendance`;

  if (attendanceDue) {
    return (
      <VStack gap="125">
        <ActionNotice
          title="출석을 확인해 주세요"
          lines={["참석하지 않은 사람만 고르면 됩니다."]}
          colorPalette="primary"
        />
        <Button render={<ServerLink path={attendancePath} />} size="lg" className="w-full">
          출석 확인하기
        </Button>
      </VStack>
    );
  }

  if (attendanceRecorded) {
    return (
      <Button
        render={<ServerLink path={attendancePath} />}
        variant="tinted"
        size="lg"
        className="w-full"
      >
        출석 기록 보기
      </Button>
    );
  }

  return <ManageGameLink gameId={gameId} />;
}
