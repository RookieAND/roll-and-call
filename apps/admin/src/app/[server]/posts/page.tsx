import type { Metadata } from "next";

import { parseSort, stringParams } from "@/shared/lib";
import { listPosts, POST_DEFAULT_SORT, POST_SORT_COLUMNS } from "@/shared/server";
import { PostsView } from "@/views/posts";

export const metadata: Metadata = { title: "구인" };

export default async function PostsPage({ searchParams }: PageProps<"/[server]/posts">) {
  const params = await searchParams;
  const { q, status, rulebook, sort, dir, page } = stringParams(params);
  const tableSort = parseSort({
    searchParams: params,
    columns: POST_SORT_COLUMNS,
    fallback: POST_DEFAULT_SORT,
  });
  const posts = await listPosts({ query: q, status, rulebook, sort: tableSort });
  return (
    <PostsView
      posts={posts}
      sort={tableSort}
      page={page}
      query={{ q, status, rulebook, sort, dir, page }}
    />
  );
}
