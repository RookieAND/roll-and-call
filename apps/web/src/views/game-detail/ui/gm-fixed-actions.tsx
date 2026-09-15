import { VStack } from "@trpg/ui";

import { ActionHint } from "./action-hint";
import { ManageParticipantsLink } from "./manage-participants-link";

export function GmFixedActions({ gameId }: { gameId: string }) {
  return (
    <VStack gap={2}>
      <ManageParticipantsLink gameId={gameId} />
      <ActionHint>일시 지정 글이라 일정 조율은 없습니다.</ActionHint>
    </VStack>
  );
}
