import { VStack } from "@trpg/ui";

import { ConfirmedSessionNotice } from "@/entities/game";

import { ManageGameLink } from "./manage-game-link";

interface GmActionsProps {
  gameId: string;
  confirmedAt: Date | null;
}

// GM에게도 상세는 읽는 화면이다. 시간 확정 · 참여자 관리 · 세션 준비는 운영 관리 한 곳으로 보낸다.
export function GmActions({ gameId, confirmedAt }: GmActionsProps) {
  return (
    <VStack gap="125">
      {confirmedAt && <ConfirmedSessionNotice confirmedAt={confirmedAt} />}
      <ManageGameLink gameId={gameId} />
    </VStack>
  );
}
