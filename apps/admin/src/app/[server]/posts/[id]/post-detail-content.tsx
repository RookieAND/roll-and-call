import { notFound } from "next/navigation";

import { type PostListFilter } from "@/entities/post";
import { getPostDetail } from "@/entities/post/server";
import { getCurrentServer, requireStaff } from "@/shared/server";
import { PostDetailView } from "@/views/post-detail";

interface PostDetailContentProps {
  id: string;
  tab: string | undefined;
  filter: PostListFilter;
  pageSize: number;
  listQuery: Record<string, string | undefined>;
}

export async function PostDetailContent({
  id,
  tab,
  filter,
  pageSize,
  listQuery,
}: PostDetailContentProps) {
  const [post, server, staff] = await Promise.all([
    getPostDetail({ id, filter, pageSize }),
    getCurrentServer(),
    requireStaff(),
  ]);
  if (!post) notFound();
  const userAppUrl = process.env.NEXT_PUBLIC_USER_APP_URL;
  return (
    <PostDetailView
      post={post}
      tab={tab}
      listQuery={listQuery}
      viewerId={staff.id}
      serverAppUrl={userAppUrl && `${userAppUrl}/${server.slug}`}
    />
  );
}
