import type { Metadata } from "next";

import { listPosts } from "@/shared/server";
import { PostsView } from "@/views/posts";

export const metadata: Metadata = { title: "구인" };

export default async function PostsPage({ searchParams }: PageProps<"/posts">) {
  const { q, status, rulebook, filter } = (await searchParams) as Record<
    string,
    string | undefined
  >;
  const posts = await listPosts({
    query: q,
    status,
    rulebook,
    reportedOnly: filter === "reported",
  });
  return <PostsView posts={posts} query={{ q, status, rulebook, filter }} />;
}
