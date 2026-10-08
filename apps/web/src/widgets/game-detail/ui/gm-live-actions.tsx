import { VStack } from "@roll-and-call/ui";

import { ActionNotice } from "./action-notice";
import { ManageGameLink } from "./manage-game-link";

interface GmLiveActionsProps {
  gameId: string;
  attendanceExpected: boolean;
}

export function GmLiveActions({ gameId, attendanceExpected }: GmLiveActionsProps) {
  if (!attendanceExpected) return <ManageGameLink gameId={gameId} />;

  return (
    <VStack gap="125">
      <ActionNotice
        title="세션이 진행 중입니다"
        lines={["끝나면 운영 관리에서 출석을 확인하세요."]}
      />
      <ManageGameLink gameId={gameId} />
    </VStack>
  );
}
