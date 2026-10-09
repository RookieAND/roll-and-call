import { VStack } from "@roll-and-call/ui";

import type { GameCancelKind } from "@/entities/game";
import { ReopenGameLink } from "@/features/reopen-game";

import { cancelledNotice } from "../model/cancelled-notice";
import { ActionNotice } from "./action-notice";
import { ActionPair } from "./action-pair";
import { ManageGameLink } from "./manage-game-link";
import { SimilarGamesLink } from "./similar-games-link";

interface CancelledActionsProps {
  gameId: string;
  cancelKind: GameCancelKind;
  reason: string | null;
  isGm: boolean;
  reopenable: boolean;
  selection: boolean;
}

export function CancelledActions({
  gameId,
  cancelKind,
  reason,
  isGm,
  reopenable,
  selection,
}: CancelledActionsProps) {
  const { title, line } = cancelledNotice({ cancelKind, selection, reason });

  return (
    <VStack gap="125">
      <ActionNotice title={title} lines={[line]} />
      {isGm ? (
        <ActionPair>
          <ManageGameLink gameId={gameId} />
          {reopenable && <ReopenGameLink gameId={gameId} />}
        </ActionPair>
      ) : (
        <SimilarGamesLink size="lg" className="w-full" />
      )}
    </VStack>
  );
}
