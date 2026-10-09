import { VStack } from "@roll-and-call/ui";

import { GAME_CANCEL_KIND, type GameCancelKind } from "@/entities/game";

import { ActionNotice } from "./action-notice";
import { ManageGameLink } from "./manage-game-link";
import { SimilarGamesLink } from "./similar-games-link";

const CANCELLED_TITLE: Record<GameCancelKind, string> = {
  [GAME_CANCEL_KIND.gm]: "GM이 구인을 취소했습니다",
  [GAME_CANCEL_KIND.staff]: "운영진이 구인을 취소했습니다",
  [GAME_CANCEL_KIND.auto]: "GM이 서버를 나가 구인이 취소되었습니다",
  [GAME_CANCEL_KIND.minPlayersUnmet]: "최소 인원이 모이지 않아 취소되었습니다",
  [GAME_CANCEL_KIND.selectionExpired]: "기한 안에 선발을 마치지 않아 취소되었습니다",
};

interface CancelledActionsProps {
  gameId: string;
  cancelKind: GameCancelKind;
  reason: string | null;
  isGm: boolean;
}

// 사유는 GM 취소만 보인다. 운영진 취소·인증 반려 자동 취소는 사유 없이 같은 안내다(D267).
export function CancelledActions({ gameId, cancelKind, reason, isGm }: CancelledActionsProps) {
  const showReason = cancelKind === GAME_CANCEL_KIND.gm && reason;
  const line = showReason ? `사유: ${reason}` : "비슷한 조건의 다른 구인글을 찾아보세요.";

  return (
    <VStack gap="125">
      <ActionNotice title={CANCELLED_TITLE[cancelKind]} lines={[line]} />
      {isGm ? (
        <ManageGameLink gameId={gameId} />
      ) : (
        <SimilarGamesLink size="lg" className="w-full" />
      )}
    </VStack>
  );
}
