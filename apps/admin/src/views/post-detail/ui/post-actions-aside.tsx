import { Callout, VStack } from "@roll-and-call/ui";
import { Eye, Shield, X } from "lucide-react";
import type { ReactElement } from "react";

import { POST_ACTION, type PostAction } from "@/features/moderate-post";
import type { PostDetail } from "@/shared/server";
import { ActionCard, ServerLink } from "@/shared/ui";

import { AsideHeading } from "./aside-heading";
import { DetailAside } from "./detail-aside";

const DISABLED_LINK = <button type="button" disabled />;

interface PostActionsAsideProps {
  // 불러오는 중이면 없고, 카드는 글자만 그대로 두고 비활성이다.
  post?: PostDetail;
  actionHref?: (action: PostAction) => string;
}

export function PostActionsAside({ post, actionHref }: PostActionsAsideProps) {
  const link = (action: PostAction): ReactElement<Record<string, unknown>> =>
    actionHref ? <ServerLink path={actionHref(action)} scroll={false} /> : DISABLED_LINK;
  const cancelShown = !post || (!post.cancelled && post.cancellable);
  const cancelLocked = post?.sessionStarted ?? false;
  return (
    <DetailAside>
      <AsideHeading>조치</AsideHeading>
      <VStack gap="075" className="p-150">
        {post?.hidden ? (
          <ActionCard
            icon={Eye}
            title="숨김 해제"
            description="목록과 검색에 다시 보이게 합니다"
            link={link(POST_ACTION.unhide)}
            tone="primary"
          />
        ) : (
          <ActionCard
            icon={Eye}
            title="숨김"
            description="목록·검색·달력·링크 미리보기에서 빠지고, 참여자만 상세를 봅니다"
            link={link(POST_ACTION.hide)}
          />
        )}
        {cancelShown ? (
          <ActionCard
            icon={X}
            title="구인 취소"
            description={
              cancelLocked ? (
                "시작한 세션은 취소할 수 없습니다"
              ) : (
                <>
                  취소한 구인은 "취소됨"으로 남고
                  <br />
                  신청과 수정이 막힙니다
                </>
              )
            }
            link={cancelLocked ? DISABLED_LINK : link(POST_ACTION.remove)}
            tone="danger"
          />
        ) : null}
        <Callout.Root colorPalette="gray" size="sm" className="mt-050">
          <Callout.Icon>
            <Shield size={14} />
          </Callout.Icon>
          <Callout.Description>운영진은 GM이 쓴 글을 직접 고치지 않습니다.</Callout.Description>
        </Callout.Root>
      </VStack>
    </DetailAside>
  );
}
