import { VStack } from "@roll-and-call/ui";

import { ActionNotice } from "./action-notice";
import { ManageGameLink } from "./manage-game-link";

interface GmLiveActionsProps {
  gameId: string;
}

export function GmLiveActions({ gameId }: GmLiveActionsProps) {
  return (
    <VStack gap="125">
      <ActionNotice title="세션이 진행 중입니다" />
      <ManageGameLink gameId={gameId} />
    </VStack>
  );
}
