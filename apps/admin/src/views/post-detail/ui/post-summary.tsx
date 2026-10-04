import { Card, Grid, HStack, Text } from "@roll-and-call/ui";

import type { PostDetail } from "@/shared/server";
import { FactRows } from "@/shared/ui";

import { receivedActionValue } from "../model/received-action-value";
import { summaryRows } from "../model/summary-rows";
import { ImagePlaceholder } from "./image-placeholder";
import { PostMoreMenu } from "./post-more-menu";
import { ZoomablePhotos } from "./zoomable-photos";

const THUMBNAIL = "썸네일";

interface PostSummaryProps {
  post: PostDetail;
  userAppHref: string | null;
  logHref: string;
}

// 제목 줄 없이 썸네일, 사실 칸, ⋯ 메뉴만 둔다(D276). 썸네일은 스포일러여도 가리지 않는다.
export function PostSummary({ post, userAppHref, logHref }: PostSummaryProps) {
  const gmValue = (
    <>
      {post.gm.nickname}
      <Text typography="body3" foreground="hint" render={<span />}>
        {receivedActionValue(post.gm.receivedActionCount)}
      </Text>
    </>
  );
  const [leftRows, rightRows] = summaryRows({ post, gmValue });
  return (
    <Card.Root
      padding="none"
      render={<HStack align="center" gap="150" />}
      className="shrink-0 px-200 py-175"
    >
      {post.thumbnailUrl ? (
        <ZoomablePhotos
          photos={[post.thumbnailUrl]}
          title={post.title}
          subtitle={THUMBNAIL}
          className="h-[64px] w-[96px]"
        />
      ) : (
        <ImagePlaceholder label={THUMBNAIL} className="h-[64px] w-[96px]" />
      )}
      <Grid className="min-w-0 flex-1 grid-cols-2 items-start gap-x-400">
        <FactRows items={leftRows} />
        <FactRows items={rightRows} />
      </Grid>
      <PostMoreMenu
        userAppHref={userAppHref}
        gmId={post.gm.id}
        postId={post.id}
        logHref={logHref}
      />
    </Card.Root>
  );
}
