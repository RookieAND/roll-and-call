import { notFound } from "next/navigation";

import { getCurrentServer, getPostDetail, type PostListFilter } from "@/shared/server";
import { PostDetailView } from "@/views/post-detail";

interface PostDetailContentProps {
  id: string;
  tab: string | undefined;
  action: string | undefined;
  filter: PostListFilter;
  listQuery: Record<string, string | undefined>;
}

export async function PostDetailContent({
  id,
  tab,
  action,
  filter,
  listQuery,
}: PostDetailContentProps) {
  const [post, server] = await Promise.all([getPostDetail({ id, filter }), getCurrentServer()]);
  if (!post) notFound();
  const userAppUrl = process.env.NEXT_PUBLIC_USER_APP_URL;
  return (
    <PostDetailView
      post={post}
      tab={tab}
      action={action}
      listQuery={listQuery}
      serverAppUrl={userAppUrl && `${userAppUrl}/${server.slug}`}
    />
  );
}
