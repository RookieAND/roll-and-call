import type { Metadata } from "next";
import { Suspense } from "react";

import { getPostDetail } from "@/shared/server";
import { POST_DETAIL_TAB, PostDetailLoading, PostReviewsLoading } from "@/views/post-detail";

import { PostDetailContent } from "./post-detail-content";

export async function generateMetadata({
  params,
}: PageProps<"/[server]/posts/[id]">): Promise<Metadata> {
  const post = await getPostDetail((await params).id);
  return { title: post ? `${post.title} 구인 상세` : "구인 상세" };
}

// 탭을 바꾸면 그 탭 모양의 불러오는 중 화면을 보여 준다. 조치 모달(action)을 열 때는 화면을 유지한다.
export default async function PostDetailPage({
  params,
  searchParams,
}: PageProps<"/[server]/posts/[id]">) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const { tab, action, page } = query as Record<string, string | undefined>;
  const fallback = tab === POST_DETAIL_TAB.reviews ? <PostReviewsLoading /> : <PostDetailLoading />;
  return (
    <Suspense key={tab} fallback={fallback}>
      <PostDetailContent id={id} tab={tab} action={action} page={page} />
    </Suspense>
  );
}
