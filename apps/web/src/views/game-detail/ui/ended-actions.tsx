import { HStack, VStack } from "@roll-and-call/ui";

import { formatDateWeekday } from "@/shared/lib";

import { ActionNotice } from "./action-notice";
import { ReviewsLink } from "./reviews-link";
import { SimilarGamesLink } from "./similar-games-link";

interface EndedActionsProps {
  gameId: string;
  confirmedAt: Date;
}

// 끝난 세션에서는 후기를 보거나 다음 세션을 찾는다.
export function EndedActions({ gameId, confirmedAt }: EndedActionsProps) {
  return (
    <VStack gap="125">
      <ActionNotice
        title={`${formatDateWeekday(confirmedAt)}에 세션이 끝났습니다`}
        colorPalette="gray"
      >
        출석은 GM이 확인한 뒤 마이페이지 기록에 남습니다.
      </ActionNotice>
      <HStack gap="100">
        <ReviewsLink gameId={gameId} />
        <SimilarGamesLink size="lg" className="min-w-0 flex-1" />
      </HStack>
    </VStack>
  );
}
