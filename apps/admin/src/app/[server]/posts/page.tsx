import type { Metadata } from "next";

import { POST_DEFAULT_SORT, POST_SORT_COLUMNS } from "@/entities/post";
import { listPosts } from "@/entities/post/server";
import { parseSort, stringParams } from "@/shared/lib";
import { PostsMobileView, PostsView } from "@/views/posts";

export const metadata: Metadata = { title: "구인" };

export default async function PostsPage({ searchParams }: PageProps<"/[server]/posts">) {
  const params = await searchParams;
  const { q, status, rulebook, sort, dir, page, pageSize } = stringParams(params);
  const tableSort = parseSort({
    searchParams: params,
    columns: POST_SORT_COLUMNS,
    fallback: POST_DEFAULT_SORT,
  });
  const posts = await listPosts({ query: q, status, rulebook, sort: tableSort });
  const query = { q, status, rulebook, sort, dir, page, pageSize };
  return (
    <>
      <div className="contents max-lg:hidden">
        <PostsView posts={posts} sort={tableSort} page={page} query={query} />
      </div>
      <div className="contents lg:hidden">
        <PostsMobileView posts={posts} sort={tableSort} query={query} />
      </div>
    </>
  );
}
