import { VStack } from "@roll-and-call/ui";

import { ActionNotice } from "./action-notice";
import { ActionPair } from "./action-pair";
import { ReviewsLink } from "./reviews-link";
import { SimilarGamesLink } from "./similar-games-link";

interface ClosedActionsProps {
  title: string;
  description?: string;
  reviewsGameId?: string;
}

export function ClosedActions({
  title,
  description = "비슷한 조건의 다른 구인글을 찾아보세요.",
  reviewsGameId,
}: ClosedActionsProps) {
  return (
    <VStack gap="125">
      <ActionNotice title={title} lines={[description]} />
      <ActionPair>
        {reviewsGameId && <ReviewsLink gameId={reviewsGameId} />}
        <SimilarGamesLink size="lg" />
      </ActionPair>
    </VStack>
  );
}
