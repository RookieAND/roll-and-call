import { HStack, VStack } from "@roll-and-call/ui";

import { ActionNotice } from "./action-notice";
import { ReviewsLink } from "./reviews-link";
import { SimilarGamesLink } from "./similar-games-link";

interface ClosedActionsProps {
  title?: string;
  reviewsGameId?: string;
}

export function ClosedActions({ title = "모집이 끝났습니다", reviewsGameId }: ClosedActionsProps) {
  return (
    <VStack gap="125">
      <ActionNotice title={title} colorPalette="gray">
        비슷한 조건의 다른 구인글을 찾아보세요.
      </ActionNotice>
      {reviewsGameId ? (
        <HStack gap="100">
          <ReviewsLink gameId={reviewsGameId} />
          <SimilarGamesLink size="lg" className="min-w-0 flex-1" />
        </HStack>
      ) : (
        <SimilarGamesLink size="lg" className="w-full" />
      )}
    </VStack>
  );
}
