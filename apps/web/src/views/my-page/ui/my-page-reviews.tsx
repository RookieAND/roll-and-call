import { Text, VStack } from "@roll-and-call/ui";

import { CountLinkRow } from "@/shared/ui";

import { MY_PAGE_GROUP_CLASS } from "./my-page-group-class";

interface MyPageReviewsProps {
  received: number;
  written: number;
}

export function MyPageReviews({ received, written }: MyPageReviewsProps) {
  return (
    <VStack gap="125" render={<section />}>
      <Text typography="heading3" render={<h2 />}>
        후기
      </Text>
      <div className={MY_PAGE_GROUP_CLASS}>
        <CountLinkRow label="받은 후기" count={received} href="/me/reviews/received" />
        <CountLinkRow label="내가 쓴 후기" count={written} href="/me/reviews" />
      </div>
    </VStack>
  );
}
