import { notFound } from "next/navigation";

import { getCurrentServer, getPostDetail } from "@/shared/server";
import { PostDetailView } from "@/views/post-detail";

interface PostDetailContentProps {
  id: string;
  tab: string | undefined;
  action: string | undefined;
  page: string | undefined;
}

export async function PostDetailContent({ id, tab, action, page }: PostDetailContentProps) {
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
