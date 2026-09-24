import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getPostDetail } from "@/shared/server";
import { PostDetailView } from "@/views/post-detail";

export async function generateMetadata({ params }: PageProps<"/posts/[id]">): Promise<Metadata> {
  const post = await getPostDetail((await params).id);
  return { title: post ? `${post.title} 구인 상세` : "구인 상세" };
}

export default async function PostDetailPage({ params, searchParams }: PageProps<"/posts/[id]">) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const { tab, action } = query as Record<string, string | undefined>;
  const post = await getPostDetail(id);
  if (!post) notFound();
  return (
    <PostDetailView
      post={post}
      tab={tab}
      action={action}
      userAppUrl={process.env.NEXT_PUBLIC_USER_APP_URL}
    />
  );
}
