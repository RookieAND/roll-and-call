import { Callout, Text, VStack } from "@roll-and-call/ui";
import { Check, Eye, Shield, X } from "lucide-react";
import Link from "next/link";

import { REVIEW_ACTION, type ReviewAction } from "@/features/moderate-review";
import type { ReviewDetail } from "@/shared/server";
import { ActionCard } from "@/shared/ui";

import { AuthorInfo } from "./author-info";

interface ReviewActionsAsideProps {
  review: ReviewDetail;
  actionHref: (action: ReviewAction) => string;
}

export function ReviewActionsAside({ review, actionHref }: ReviewActionsAsideProps) {
  return (
    <VStack
      render={<aside />}
      className="sticky top-(--rc-size-appbar) h-[calc(100dvh-var(--rc-size-appbar))] w-[300px] shrink-0 overflow-y-auto border-l border-gray-200 bg-surface"
    >
      <Text
        typography="subtitle2"
        foreground="muted"
        render={<h2 />}
        className="border-b border-(--rc-color-border-subtle) bg-gray-50 px-175 py-125"
      >
        조치
      </Text>
      <VStack gap="075" className="p-150">
        {review.reports.length ? (
          <ActionCard
            icon={Check}
            title="신고 기각"
            description="후기는 그대로 두고 신고만 닫습니다"
            link={<Link href={actionHref(REVIEW_ACTION.dismiss)} scroll={false} />}
          />
        ) : null}
        {review.hidden ? (
          <ActionCard
            icon={Eye}
            title="숨김 해제"
            description="GM 프로필에 다시 보이게 합니다"
            link={<Link href={actionHref(REVIEW_ACTION.unhide)} scroll={false} />}
            tone="primary"
          />
        ) : (
          <ActionCard
            icon={Eye}
            title="숨김"
            description="작성자만 볼 수 있게 가립니다"
            link={<Link href={actionHref(REVIEW_ACTION.hide)} scroll={false} />}
          />
        )}
        <ActionCard
          icon={X}
          title="제거"
          description="본문과 사진을 바로 지웁니다"
          link={<Link href={actionHref(REVIEW_ACTION.remove)} scroll={false} />}
          tone="danger"
        />
        <Callout.Root colorPalette="gray" size="sm" className="mt-050">
          <Callout.Icon>
            <Shield size={14} />
          </Callout.Icon>
          <Callout.Description>신고만으로는 후기가 숨겨지지 않습니다.</Callout.Description>
        </Callout.Root>
      </VStack>
      <AuthorInfo author={review.author} />
    </VStack>
  );
}
