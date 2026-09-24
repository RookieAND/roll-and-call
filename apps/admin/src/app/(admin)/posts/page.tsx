import type { Metadata } from "next";

import { listPosts } from "@/shared/server";
import { PostsView } from "@/views/posts";

export const metadata: Metadata = { title: "구인" };

export default async function PostsPage({ searchParams }: PageProps<"/posts">) {
  const { q, status, rulebook, period, filter, page } = (await searchParams) as Record<
    string,
    string | undefined
  >;
  const posts = await listPosts({
    query: q,
    status,
    rulebook,
    period,
    reportedOnly: filter === "reported",
  });
  return <PostsView posts={posts} page={page} query={{ q, status, rulebook, period, filter }} />;
}
