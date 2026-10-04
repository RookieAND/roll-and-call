import { HStack, VStack } from "@roll-and-call/ui";

import { paginate, sessionTimeLabel, withQuery, type TableSort } from "@/shared/lib";
import type { listPosts, PostSortColumn } from "@/shared/server";
import {
  AdminHeader,
  CsvExportButton,
  EMPTY_IMAGE,
  ListPager,
  Panel,
  UrlSearchInput,
  UrlSelect,
} from "@/shared/ui";

import { PostsTable } from "./posts-table";

const EMPTY = {
  none: {
    title: "아직 열린 구인이 없습니다",
    description: "사용자가 구인을 열면 이곳에 표시됩니다.",
    image: EMPTY_IMAGE.hosted,
  },
  filtered: {
    title: "검색 결과가 없습니다",
    description: (
      <>
        제목과 GM 닉네임으로 검색합니다.
        <br />
        필터를 줄이면 더 많은 구인을 볼 수 있습니다.
      </>
    ),
    image: EMPTY_IMAGE.search,
  },
} as const;

interface PostsViewProps {
  posts: Awaited<ReturnType<typeof listPosts>>;
  sort: TableSort<PostSortColumn>;
  page?: string;
  // 들어온 목록의 검색·필터·정렬·쪽. 상세 주소에 그대로 실어 [다음 건]과 뒤로 가기가 쓴다.
  query: Record<string, string | undefined>;
}

export function PostsView({ posts, sort, page, query }: PostsViewProps) {
  const paged = paginate(posts.rows, page);
  const empty = posts.total === 0 ? EMPTY.none : EMPTY.filtered;
  const pager = (
    <ListPager
      page={paged.page}
      totalPages={paged.totalPages}
      total={posts.rows.length}
      unit="건"
    />
  );
  const csvButton = (
    <CsvExportButton
      fileName="구인 목록.csv"
      header={["제목", "GM", "룰북", "세션 일시", "참여", "상태", "운영진 조치"]}
      rows={posts.rows.map((row) => [
        row.title,
        row.gmNickname,
        row.rulebook,
        sessionTimeLabel(row.sessionAt),
        `${row.memberCount}/${row.capacity}`,
        row.status,
        row.staffAction ?? "",
      ])}
    />
  );
  const toOptions = (values: readonly string[]) => values.map((value) => ({ label: value, value }));
  const listPage = paged.page > 1 ? String(paged.page) : undefined;
  const detailQuery = withQuery("", query, { page: listPage });

  return (
    <>
      <AdminHeader title="구인" sub={`${posts.rows.length}건`} />
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
          <HStack className="ml-auto">{csvButton}</HStack>
        </HStack>
        <Panel className="flex-1" footer={posts.rows.length ? pager : null}>
          <PostsTable rows={paged.rows} sort={sort} empty={empty} detailQuery={detailQuery} />
        </Panel>
      </VStack>
    </>
  );
}
