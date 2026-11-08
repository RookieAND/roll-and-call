import { Text, VStack } from "@roll-and-call/ui";

import { serverPath } from "@/shared/lib";
import { getCurrentServer } from "@/shared/server";

import { MY_PAGE_GROUP_CLASS } from "./my-page-group-class";
import { MyPageReviewRow } from "./my-page-review-row";

interface MyPageReviewsProps {
  received: number;
  written: number;
  showReceived: boolean;
}

export async function MyPageReviews({ received, written, showReceived }: MyPageReviewsProps) {
  const server = await getCurrentServer();
  return (
    <VStack gap="125" render={<section />}>
      <Text typography="heading3" render={<h2 />}>
        후기
      </Text>
      <div className={MY_PAGE_GROUP_CLASS}>
        {showReceived && (
          <MyPageReviewRow
            label="진행한 세션 후기"
            count={received}
            href={serverPath({ slug: server.slug, path: "/me/reviews/received" })}
          />
        )}
        <MyPageReviewRow
          label="내가 쓴 후기"
          count={written}
          href={serverPath({ slug: server.slug, path: "/me/reviews" })}
        />
      </div>
    </VStack>
  );
}
