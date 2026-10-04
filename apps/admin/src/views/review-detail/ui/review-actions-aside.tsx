import { VStack } from "@roll-and-call/ui";
import { Eye, X } from "lucide-react";
import type { ReactElement } from "react";

import { REVIEW_ACTION, type ReviewAction } from "@/features/moderate-review";
import type { ReviewDetail } from "@/shared/server";
import { ActionCard, ServerLink } from "@/shared/ui";

import { AsideHeading } from "./aside-heading";

const DISABLED_LINK = <button type="button" disabled />;

interface ReviewActionsAsideProps {
  // 불러오는 중이면 없고, 카드는 글자만 그대로 두고 비활성이다.
  review?: ReviewDetail;
  actionHref?: (action: ReviewAction) => string;
}

// 조치 효과 설명은 이 카드에만 있다(D273). 설명에는 마침표를 붙이지 않는다.
export function ReviewActionsAside({ review, actionHref }: ReviewActionsAsideProps) {
  const link = (action: ReviewAction): ReactElement<Record<string, unknown>> =>
    actionHref ? <ServerLink path={actionHref(action)} scroll={false} /> : DISABLED_LINK;
  return (
    <VStack
      render={<aside />}
      className="sticky top-(--rc-size-appbar) h-[calc(100dvh-var(--rc-size-appbar))] w-[300px] shrink-0 overflow-y-auto border-l border-gray-200 bg-surface"
    >
      <AsideHeading>조치</AsideHeading>
      <VStack gap="075" className="p-150">
        {review?.hidden ? (
          <ActionCard
            icon={Eye}
            title="숨김 해제"
            description="다시 모두에게 보입니다"
            link={link(REVIEW_ACTION.unhide)}
            tone="primary"
          />
        ) : (
          <ActionCard
            icon={Eye}
            title="숨김"
            description="작성자만 볼 수 있게 가립니다"
            link={link(REVIEW_ACTION.hide)}
          />
        )}
        <ActionCard
          icon={X}
          title="제거"
          description="후기를 바로 지웁니다"
          link={link(REVIEW_ACTION.remove)}
          tone="danger"
        />
      </VStack>
    </VStack>
  );
}
