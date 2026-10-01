import { Card, VStack } from "@roll-and-call/ui";

import { CountLinkRow } from "@/shared/ui";

import { ProfileBlockLabel } from "./profile-block-label";

interface ProfileReviewsProps {
  userId: string;
  received: number | null;
  written: number;
}

export function ProfileReviews({ userId, received, written }: ProfileReviewsProps) {
  return (
    <VStack render={<section />} className="px-200 pt-200">
      <ProfileBlockLabel label="후기" />
      <Card.Root padding="none" radius={500} className="overflow-hidden">
        {received !== null && (
          <CountLinkRow
            label="진행한 세션 후기"
            count={received}
            href={`/u/${userId}/reviews/received`}
          />
        )}
        <CountLinkRow label="작성한 후기" count={written} href={`/u/${userId}/reviews/written`} />
      </Card.Root>
    </VStack>
  );
}
