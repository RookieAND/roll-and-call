import { Badge, Grid, HStack, Text } from "@roll-and-call/ui";

import { formatDateTime, formatSessionTime } from "@/shared/lib";
import type { PostDetail } from "@/shared/server";
import { FactRows } from "@/shared/ui";

import { POST_STATUS_TONE } from "../model/post-status-tone";
import { ImagePlaceholder } from "./image-placeholder";
import { PostMoreMenu } from "./post-more-menu";

interface PostSummaryProps {
  post: PostDetail;
  userAppHref: string | null;
  logHref: string;
}

// 제목과 모집 상태, 세션·모집 조건만. 나머지는 탭으로 나눈다.
export function PostSummary({ post, userAppHref, logHref }: PostSummaryProps) {
  return (
    <section className="shrink-0 rounded-600 border border-gray-200 bg-surface">
      <HStack align="center" gap="150" className="px-200 py-175">
        {post.thumbnailUrl ? (
          <img
            src={post.thumbnailUrl}
            alt=""
            className="h-[64px] w-[96px] shrink-0 rounded-300 border border-gray-200 object-cover"
          />
        ) : (
          <ImagePlaceholder label="썸네일" className="h-[64px] w-[96px]" />
        )}
        <HStack align="center" gap="100" wrap className="min-w-0 flex-1">
          <Text typography="heading3" render={<h2 />}>
            {post.title}
          </Text>
          <Badge colorPalette={POST_STATUS_TONE[post.status]}>{post.status}</Badge>
        </HStack>
        <PostMoreMenu userAppHref={userAppHref} gmId={post.gm.id} logHref={logHref} />
      </HStack>
      <Grid className="grid-cols-2 items-start gap-x-400 border-t border-(--rc-color-border-subtle) px-200 py-100">
        <FactRows
          items={[
            { label: "세션 일정", value: formatSessionTime(post.startsAt) },
            { label: "플레이타임", value: post.playTime ?? "—" },
            { label: "룰", value: post.rulebook },
          ]}
        />
        <FactRows
          items={[
            {
              label: "모집 마감일",
              value: post.recruitDeadline ? formatDateTime(post.recruitDeadline) : "—",
            },
            { label: "GM", value: post.gm.nickname },
          ]}
        />
      </Grid>
    </section>
  );
}
