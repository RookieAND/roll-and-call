import { Card, Grid, HStack, Text } from "@roll-and-call/ui";

import type { PostDetail } from "@/shared/server";
import { FactRows } from "@/shared/ui";

import { receivedActionValue } from "../model/received-action-value";
import { summaryRows } from "../model/summary-rows";
import { PostMoreMenu } from "./post-more-menu";

interface PostSummaryProps {
  post: PostDetail;
  userAppHref: string | null;
  logHref: string;
}

// 제목 줄 없이 사실 칸과 ⋯ 메뉴만 둔다. 썸네일은 구인 내용 탭에 있다.
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
