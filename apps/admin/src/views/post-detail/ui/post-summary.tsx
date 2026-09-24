import { Badge } from "@roll-and-call/ui";

import { formatDateTime, formatSessionTime } from "@/shared/lib";
import type { PostDetail } from "@/shared/server";
import { EntityHead } from "@/shared/ui";

import { ImagePlaceholder } from "./image-placeholder";
import { PostMoreMenu } from "./post-more-menu";

interface PostSummaryProps {
  post: PostDetail;
  userAppHref: string | null;
  logHref: string;
}

// 제목과 세션·모집 조건만. 나머지는 탭으로 나눈다.
export function PostSummary({ post, userAppHref, logHref }: PostSummaryProps) {
  return (
    <EntityHead
      title={post.title}
      lead={
        post.thumbnailUrl ? (
          <img
            src={post.thumbnailUrl}
            alt=""
            className="h-[62px] w-[94px] shrink-0 rounded-300 border border-gray-200 object-cover"
          />
        ) : (
          <ImagePlaceholder label="썸네일" className="h-[62px] w-[94px]" />
        )
      }
      badges={<Badge colorPalette="primary">{post.rulebook}</Badge>}
      actions={<PostMoreMenu userAppHref={userAppHref} gmId={post.gm.id} logHref={logHref} />}
      facts={[
        {
          label: "세션 일시",
          value: formatSessionTime(post.startsAt),
          sub: post.expectedHours ? `${post.expectedHours}시간 예상` : undefined,
        },
        {
          label: "참여 인원",
          value: `${post.memberCount} / ${post.capacity}`,
          sub: post.waitingCount ? `대기 ${post.waitingCount}명` : undefined,
        },
        { label: "모집 방식", value: post.recruitMethod ?? "—" },
        {
          label: "모집 마감",
          value: post.recruitDeadline ? formatDateTime(post.recruitDeadline) : "—",
        },
      ]}
    />
  );
}
