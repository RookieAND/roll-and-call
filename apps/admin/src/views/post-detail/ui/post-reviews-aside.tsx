import { Callout, VStack } from "@roll-and-call/ui";

import { formatDate } from "@/shared/lib";
import type { PostDetail } from "@/shared/server";
import type { Fact } from "@/shared/ui";

import { receivedActionValue } from "../model/received-action-value";
import { AsideHeading } from "./aside-heading";
import { DetailAside } from "./detail-aside";
import { GmInfo } from "./gm-info";

interface PostReviewsAsideProps {
  post: PostDetail;
}

// 후기 탭은 구인 조치 대신 안내와 후기 기준의 GM 정보를 보여 준다(시안 RvAside).
export function PostReviewsAside({ post }: PostReviewsAsideProps) {
  const { gm } = post;
  const locked = !post.attendance.confirmedAt;
  const notice = locked
    ? "출석 확인은 GM이나 시스템이 합니다."
    : "신고만으로는 후기가 숨겨지지 않습니다.";
  const facts: Fact[] = locked
    ? [
        { label: "출석 확인 대기", value: `${gm.pendingAttendanceCount}건` },
        { label: "연 구인", value: `${gm.hostedCount}건` },
      ]
    : [
        {
          label: "받은 후기",
          value: `${gm.receivedReviewCount}개`,
          sub: `세션 ${gm.reviewedSessionCount}개`,
        },
        {
          label: "받은 조치",
          value: receivedActionValue(gm.hideCount),
          danger: gm.hideCount > 0,
        },
      ];
  return (
    <DetailAside>
      <AsideHeading>안내</AsideHeading>
      <VStack className="p-150">
        <Callout.Root colorPalette="gray" size="sm">
          <Callout.Description>{notice}</Callout.Description>
        </Callout.Root>
      </VStack>
      <GmInfo
        nickname={gm.nickname}
        meta={`@${gm.discordHandle} · ${formatDate(gm.joinedAt)} 가입`}
        facts={facts}
      />
    </DetailAside>
  );
}
