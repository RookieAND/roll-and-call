import { Card, HStack } from "@roll-and-call/ui";

import type { PostDetail } from "@/entities/post/server";
import { FactRows } from "@/shared/ui";

import { summaryRows } from "../model/summary-rows";
import { GmValue } from "./gm-value";
import { PostMoreMenu } from "./post-more-menu";

interface PostSummaryProps {
  post: PostDetail;
  userAppHref: string | null;
  logHref: string;
}

// 제목 줄 없이 사실 칸과 ⋯ 메뉴만 둔다. 썸네일은 구인 내용 탭에 있다.
export function PostSummary({ post, userAppHref, logHref }: PostSummaryProps) {
  const rows = summaryRows({ post, gmValue: <GmValue gm={post.gm} /> });
  return (
    <Card.Root
      padding="none"
      render={<HStack align="center" gap="150" />}
      className="shrink-0 px-200 py-175"
    >
      <div className="min-w-0 flex-1">
        <FactRows items={rows} />
      </div>
      <PostMoreMenu
        userAppHref={userAppHref}
        gmId={post.gm.id}
        postId={post.id}
        logHref={logHref}
      />
    </Card.Root>
  );
}
