import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCurrentServer, getPostDetail } from "@/shared/server";
import { PostDetailView } from "@/views/post-detail";

export async function generateMetadata({
  params,
}: PageProps<"/[server]/posts/[id]">): Promise<Metadata> {
  const post = await getPostDetail((await params).id);
  return { title: post ? `${post.title} 구인 상세` : "구인 상세" };
}

export default async function PostDetailPage({
  params,
  searchParams,
}: PageProps<"/[server]/posts/[id]">) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const { tab, action, page } = query as Record<string, string | undefined>;
  const [post, server] = await Promise.all([getPostDetail(id), getCurrentServer()]);
  if (!post) notFound();
  const userAppUrl = process.env.NEXT_PUBLIC_USER_APP_URL;
  return (
    <PostDetailView
      post={post}
      tab={tab}
      action={action}
      page={page}
      serverAppUrl={userAppUrl && `${userAppUrl}/${server.slug}`}
    />
  );
}
