import { notFound } from "next/navigation";

import { type PostListFilter } from "@/entities/post";
import { getPostDetail } from "@/entities/post/server";
import { getCurrentServer, requireStaff } from "@/shared/server";
import { PostDetailMobileView, PostDetailView } from "@/views/post-detail";

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
  const serverAppUrl = userAppUrl && `${userAppUrl}/${server.slug}`;
  // 조치·신청글 모달은 데스크톱 화면이 띄우고, 모바일에선 같은 모달이 시트로 열린다.
  return (
    <>
      <div className="contents max-lg:hidden">
        <PostDetailView
          post={post}
          tab={tab}
          listQuery={listQuery}
          viewerId={staff.id}
          serverAppUrl={serverAppUrl}
        />
      </div>
      <div className="contents lg:hidden">
        <PostDetailMobileView
          post={post}
          tab={tab}
          listQuery={listQuery}
          serverAppUrl={serverAppUrl}
        />
      </div>
    </>
  );
}
