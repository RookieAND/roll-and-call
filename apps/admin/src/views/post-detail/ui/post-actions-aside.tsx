import { Callout, Text, VStack } from "@roll-and-call/ui";
import { Check, Eye, FileText, Shield } from "lucide-react";

import { POST_ACTION, type PostAction } from "@/features/moderate-post";
import type { PostDetail } from "@/shared/server";

import { ActionCard } from "./action-card";
import { GmInfo } from "./gm-info";

interface PostActionsAsideProps {
  post: PostDetail;
  actionHref: (action: PostAction) => string;
}

export function PostActionsAside({ post, actionHref }: PostActionsAsideProps) {
  const reported = post.unresolvedReportCount > 0;
  const notice = reported
    ? `셋 중 무엇을 확정하든 이 구인의 처리 안 된 신고 ${post.unresolvedReportCount}건이 모두 처리됨으로 바뀝니다. 신고자에게는 알리지 않습니다.`
    : "운영진은 GM이 쓴 글을 직접 고치지 않습니다. 두 조치 모두 사유가 필요하고, GM에게만 알림이 갑니다.";
  return (
    <VStack
      render={<aside />}
      className="sticky top-(--rc-size-appbar) h-[calc(100dvh-var(--rc-size-appbar))] w-[288px] shrink-0 overflow-y-auto border-l border-gray-200 bg-surface"
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
        <ActionCard
          icon={FileText}
          title="GM에게 수정 요청"
          description="구인은 그대로 두고 고쳐 달라고 알립니다"
          href={actionHref(POST_ACTION.edit)}
        />
        {post.hidden ? (
          <ActionCard
            icon={Eye}
            title="숨김 해제"
            description="목록과 검색에 다시 보이게 합니다"
            href={actionHref(POST_ACTION.unhide)}
            highlighted
          />
        ) : (
          <ActionCard
            icon={Eye}
            title="숨김"
            description="목록과 검색에서만 빠집니다"
            href={actionHref(POST_ACTION.hide)}
          />
        )}
        {reported ? (
          <ActionCard
            icon={Check}
            title="처리 완료 (조치 없음)"
            description="문제가 없다고 보고 신고만 닫습니다"
            href={actionHref(POST_ACTION.resolve)}
          />
        ) : null}
        <Callout.Root colorPalette="gray" size="sm" className="mt-050">
          <Callout.Icon>
            <Shield size={14} />
          </Callout.Icon>
          <Callout.Description>{notice}</Callout.Description>
        </Callout.Root>
      </VStack>
      <GmInfo gm={post.gm} rulebook={post.rulebook} />
    </VStack>
  );
}
