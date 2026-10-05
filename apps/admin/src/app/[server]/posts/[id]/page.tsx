import type { Metadata } from "next";
import { Suspense } from "react";

import { parseSort, stringParams } from "@/shared/lib";
import { getPostTitle, POST_DEFAULT_SORT, POST_SORT_COLUMNS } from "@/shared/server";
import { PostDetailLoading } from "@/views/post-detail";

import { PostDetailContent } from "./post-detail-content";

export async function generateMetadata({
  params,
}: PageProps<"/[server]/posts/[id]">): Promise<Metadata> {
  const title = await getPostTitle((await params).id);
  return { title: title ? `${title} 구인 상세` : "구인 상세" };
}

// 탭을 바꾸면 불러오는 중 화면을 보여 준다. 조치 모달(action)은 주소만 바꿔 열고 닫는다.
export default async function PostDetailPage({
  params,
  searchParams,
}: PageProps<"/[server]/posts/[id]">) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const { tab, q, status, rulebook, sort, dir, page } = stringParams(query);
  const tableSort = parseSort({
    searchParams: query,
    columns: POST_SORT_COLUMNS,
    fallback: POST_DEFAULT_SORT,
  });
  return (
    <Suspense key={tab} fallback={<PostDetailLoading />}>
      <PostDetailContent
        id={id}
        tab={tab}
        filter={{ query: q, status, rulebook, sort: tableSort }}
        listQuery={{ q, status, rulebook, sort, dir, page }}
      />
    </Suspense>
  );
}
