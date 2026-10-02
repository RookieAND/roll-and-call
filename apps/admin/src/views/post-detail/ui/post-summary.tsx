import { Grid, HStack, Text } from "@roll-and-call/ui";

import type { PostDetail } from "@/shared/server";
import { FactRows, type FactRow, Tag } from "@/shared/ui";

import { ImagePlaceholder } from "./image-placeholder";
import { PostMoreMenu } from "./post-more-menu";

interface PostSummaryProps {
  post: PostDetail;
  rows: [FactRow[], FactRow[]];
  userAppHref: string | null;
  logHref: string;
  removeHref: string;
}

export function PostSummary({ post, rows, userAppHref, logHref, removeHref }: PostSummaryProps) {
  const [leftRows, rightRows] = rows;
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
          <Tag>{post.status}</Tag>
        </HStack>
        <PostMoreMenu
          userAppHref={userAppHref}
          gmId={post.gm.id}
          logHref={logHref}
          removeHref={removeHref}
        />
      </HStack>
      <Grid className="grid-cols-2 items-start gap-x-400 border-t border-(--rc-color-border-subtle) px-200 py-100">
        <FactRows items={leftRows} />
        <FactRows items={rightRows} />
      </Grid>
    </section>
  );
}
