import { HStack } from "@roll-and-call/ui";

import { RouteTabs } from "./route-tabs";
import { TabCount } from "./tab-count";

export const POST_ROUTE = {
  posts: "/posts",
  reportedReviews: "/posts/reviews",
  hiddenReviews: "/posts/reviews/hidden",
} as const;

type PostRoute = (typeof POST_ROUTE)[keyof typeof POST_ROUTE];

interface PostRouteTabsProps {
  value: PostRoute;
  counts?: { reported: number; hidden: number };
}

export function PostRouteTabs({ value, counts }: PostRouteTabsProps) {
  const items = [
    { label: "구인 목록", href: POST_ROUTE.posts },
    {
      label: (
        <HStack align="center" gap="075" render={<span />}>
          신고된 후기
          {counts ? (
            <TabCount
              count={counts.reported}
              selected={value === POST_ROUTE.reportedReviews}
              danger
            />
          ) : null}
        </HStack>
      ),
      href: POST_ROUTE.reportedReviews,
    },
    {
      label: (
        <HStack align="center" gap="075" render={<span />}>
          숨긴 후기
          {counts ? (
            <TabCount count={counts.hidden} selected={value === POST_ROUTE.hiddenReviews} />
          ) : null}
        </HStack>
      ),
      href: POST_ROUTE.hiddenReviews,
    },
  ];
  return <RouteTabs label="구인 화면" items={items} value={value} />;
}
