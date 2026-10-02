import { Callout, VStack } from "@roll-and-call/ui";
import { Check, Eye, Shield, X } from "lucide-react";

import { POST_ACTION, type PostAction } from "@/features/moderate-post";
import { formatDate } from "@/shared/lib";
import type { PostDetail } from "@/shared/server";
import { ActionCard, ServerLink } from "@/shared/ui";

import { receivedActionValue } from "../model/received-action-value";
import { AsideHeading } from "./aside-heading";
import { DetailAside } from "./detail-aside";
import { GmInfo } from "./gm-info";

interface PostActionsAsideProps {
  post: PostDetail;
  actionHref: (action: PostAction) => string;
}

export function PostActionsAside({ post, actionHref }: PostActionsAsideProps) {
  const { gm } = post;
  const reported = post.unresolvedReportCount > 0;
  const notice = reported
    ? `어떤 조치를 확정해도 신고 ${post.unresolvedReportCount}건이 처리됨으로 바뀝니다. 신고자에게는 알림이 가지 않습니다.`
    : "운영진은 GM이 쓴 글을 직접 고치지 않습니다. 두 조치 모두 사유가 필요하고, GM에게만 알림이 갑니다.";
  const certifiedSub = gm.certifiedRulebooks.includes(post.rulebook)
    ? `${post.rulebook} 포함`
    : undefined;
  const link = (action: PostAction) => <ServerLink path={actionHref(action)} scroll={false} />;
  return (
    <DetailAside>
      <AsideHeading>조치</AsideHeading>
      <VStack gap="075" className="p-150">
        {post.hidden ? (
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
            description="목록과 검색에서만 빠집니다"
            link={link(POST_ACTION.hide)}
          />
        )}
        {reported ? (
          <ActionCard
            icon={Check}
            title="처리 완료 (조치 없음)"
            description="문제가 없다고 보고 신고만 닫습니다"
            link={link(POST_ACTION.resolve)}
          />
        ) : null}
        <ActionCard
          icon={X}
          title="제거"
          description="참여 정보와 후기까지 함께 삭제합니다"
          link={link(POST_ACTION.remove)}
          tone="danger"
        />
        <Callout.Root colorPalette="gray" size="sm" className="mt-050">
          <Callout.Icon>
            <Shield size={14} />
          </Callout.Icon>
          <Callout.Description>{notice}</Callout.Description>
        </Callout.Root>
      </VStack>
      <GmInfo
        nickname={gm.nickname}
        meta={`${formatDate(gm.joinedAt)} 가입`}
        facts={[
          { label: "인증 룰북", value: `${gm.certifiedRulebooks.length}개`, sub: certifiedSub },
          {
            label: "연 구인",
            value: `${gm.hostedCount}건`,
            sub: `진행 중 ${gm.ongoingHostedCount}건`,
          },
          {
            label: "받은 조치",
            value: receivedActionValue(gm.hideCount),
            danger: gm.hideCount > 0,
            sub: `숨김 ${gm.hideCount}`,
          },
          { label: "처리한 불참", value: `${gm.handledNoShowCount}건` },
        ]}
      />
    </DetailAside>
  );
}
