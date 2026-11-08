import { Card, Text, VStack } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";

import { serverPath } from "@/shared/lib";
import { getCurrentServer } from "@/shared/server";

import { ProfileReviewRow } from "./profile-review-row";

interface ProfileReviewsProps {
  userId: string;
  received: number | null;
  written: number;
}

export async function ProfileReviews({ userId, received, written }: ProfileReviewsProps) {
  const server = await getCurrentServer();
  return (
    <VStack gap="125" render={<section />} className="px-200 pb-250 desktop:py-200">
      <Text typography="heading3" render={<h2 />}>
        후기
      </Text>
      <Card.Root padding="none" radius={600} background="none" className="overflow-hidden">
        {!isNull(received) && (
          <ProfileReviewRow
            label="진행한 세션 후기"
            count={received}
            href={serverPath({ slug: server.slug, path: `/users/${userId}/reviews/received` })}
          />
        )}
        <ProfileReviewRow
          label="작성한 후기"
          count={written}
          href={serverPath({ slug: server.slug, path: `/users/${userId}/reviews/written` })}
        />
      </Card.Root>
    </VStack>
  );
}
