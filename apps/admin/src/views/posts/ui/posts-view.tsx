import { Chip, HStack, VStack } from "@roll-and-call/ui";
import Link from "next/link";

import { withQuery } from "@/shared/lib";
import { POST_PERIODS, type listPosts } from "@/shared/server";
import {
  AdminHeader,
  EMPTY_IMAGE,
  EmptyState,
  Panel,
  UrlSearchInput,
  UrlSelect,
} from "@/shared/ui";

import { PostsTable } from "./posts-table";

const REPORTED_FILTER = "reported";

interface PostsViewProps {
  posts: Awaited<ReturnType<typeof listPosts>>;
  query: Record<string, string | undefined>;
}

export function PostsView({ posts, query }: PostsViewProps) {
  const reportedOnly = query.filter === REPORTED_FILTER;
  const reportedHref = withQuery("/posts", query, {
    filter: reportedOnly ? undefined : REPORTED_FILTER,
  });
  const empty = posts.rows.length === 0;
  const sub = empty ? "검색 결과 0건" : `${posts.rows.length}건`;
  const toOptions = (values: readonly string[]) => values.map((value) => ({ label: value, value }));

  return (
    <>
      <AdminHeader title="구인" sub={sub} />
      <VStack gap="150" className="flex-1 p-200">
        <HStack align="center" gap="100" wrap>
          <UrlSearchInput placeholder="제목 · GM 닉네임 검색" className="w-[236px]" />
          <UrlSelect
            param="status"
            allLabel="상태 전체"
            options={toOptions(posts.statusOptions)}
            className="w-[126px]"
          />
          <UrlSelect
            param="rulebook"
            allLabel="룰북 전체"
            options={toOptions(posts.rulebookOptions)}
            className="w-[126px]"
          />
          <UrlSelect
            param="period"
            allLabel="세션 일시 · 전체"
            options={POST_PERIODS.map(({ label, value }) => ({ label, value }))}
            className="w-[176px]"
          />
          <Chip selected={reportedOnly} render={<Link href={reportedHref} scroll={false} />}>
            처리 안 된 신고 있음
          </Chip>
        </HStack>
        <Panel title="최신순" className="flex-1">
          {empty ? (
            <EmptyState
              image={EMPTY_IMAGE.search}
              title="검색 결과가 없습니다"
              description="제목과 GM 닉네임으로 검색합니다. 적용한 필터를 하나씩 해제해 보세요."
            />
          ) : (
            <PostsTable rows={posts.rows} />
          )}
        </Panel>
      </VStack>
    </>
  );
}
