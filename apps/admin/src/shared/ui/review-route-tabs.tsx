import { HStack } from "@roll-and-call/ui";

import { RouteTabs } from "./route-tabs";
import { TabCount } from "./tab-count";

export const REVIEW_ROUTE = {
  reported: "/reviews",
  hidden: "/reviews/hidden",
} as const;

type ReviewRoute = (typeof REVIEW_ROUTE)[keyof typeof REVIEW_ROUTE];

interface ReviewRouteTabsProps {
  value: ReviewRoute;
  counts?: { reported: number; hidden: number };
}

export function ReviewRouteTabs({ value, counts }: ReviewRouteTabsProps) {
  const items = [
    {
      label: (
        <HStack align="center" gap="075" render={<span />}>
          신고된 후기
          {counts ? (
            <TabCount count={counts.reported} selected={value === REVIEW_ROUTE.reported} danger />
          ) : null}
        </HStack>
      ),
      href: REVIEW_ROUTE.reported,
    },
    {
      label: (
        <HStack align="center" gap="075" render={<span />}>
          숨긴 후기
          {counts ? (
            <TabCount count={counts.hidden} selected={value === REVIEW_ROUTE.hidden} />
          ) : null}
        </HStack>
      ),
      href: REVIEW_ROUTE.hidden,
    },
  ];
  return <RouteTabs label="후기 화면" items={items} value={value} />;
}
