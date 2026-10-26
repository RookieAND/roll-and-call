import { Text, VStack } from "@roll-and-call/ui";

import { POST_SORT_COLUMN, type PostSortColumn } from "@/entities/post";
import type { listPosts } from "@/entities/post/server";
import {
  POST_STATUS,
  SORT_DIR,
  sessionTimeLabel,
  withQuery,
  type PostStatus,
  type TableSort,
} from "@/shared/lib";
import {
  AdminHeader,
  EMPTY_IMAGE,
  EmptyState,
  InfiniteList,
  ListRow,
  ListSortBar,
  MobileTitle,
  StatusBadges,
  Tag,
  UrlFilterChips,
  UrlSearchInput,
} from "@/shared/ui";

import { POST_STATUS_CHIPS } from "../model/post-status-chips";

const MUTED_STATUSES: readonly PostStatus[] = [POST_STATUS.ended, POST_STATUS.cancelled];

const SORT_OPTIONS = [
  { label: "세션 일시 최신순", column: POST_SORT_COLUMN.at, dir: SORT_DIR.desc },
  { label: "세션 일시 오래된 순", column: POST_SORT_COLUMN.at, dir: SORT_DIR.asc },
  { label: "참여 인원 많은 순", column: POST_SORT_COLUMN.members, dir: SORT_DIR.desc },
  { label: "참여 인원 적은 순", column: POST_SORT_COLUMN.members, dir: SORT_DIR.asc },
];

interface PostsMobileViewProps {
  posts: Awaited<ReturnType<typeof listPosts>>;
  sort: TableSort<PostSortColumn>;
  query: Record<string, string | undefined>;
}

export function PostsMobileView({ posts, sort, query }: PostsMobileViewProps) {
  const detailQuery = withQuery("", query, { page: undefined });
  const empty =
    posts.total === 0
      ? {
          title: "아직 열린 구인이 없습니다",
          description: "사용자가 구인을 열면 이곳에 표시됩니다.",
          image: EMPTY_IMAGE.hosted,
        }
      : {
          title: "조건에 맞는 구인이 없습니다",
          description: "검색어나 필터를 바꿔 보세요.",
          image: EMPTY_IMAGE.search,
        };
  return (
    <>
      <AdminHeader title={<MobileTitle title="구인" sub={`${posts.rows.length}건`} />} />
      <VStack gap="100" className="border-b border-gray-200 bg-surface px-200 py-150">
        <UrlSearchInput placeholder="제목 · GM 닉네임 검색" />
        <UrlFilterChips param="status" options={POST_STATUS_CHIPS} />
      </VStack>
      {posts.rows.length ? (
        <>
          <ListSortBar total={`${posts.rows.length}건`} sort={sort} options={SORT_OPTIONS} />
          <InfiniteList>
            {posts.rows.map((row) => (
              <ListRow
                key={row.id}
                path={`/posts/${row.id}${detailQuery}`}
                title={row.title}
                badges={row.staffAction ? <Tag>{row.staffAction}</Tag> : undefined}
                trailing={
                  <StatusBadges status={row.isPrivate ? `${row.status} · 지정 모집` : row.status} />
                }
                description={
                  <>
                    {sessionTimeLabel(row.sessionAt)} ·{" "}
                    <Text typography="body3" weight="bold" render={<b />}>
                      {row.memberCount}/{row.capacity}명
                    </Text>
                  </>
                }
                meta={`${row.rulebook} · GM ${row.gmNickname}`}
                muted={MUTED_STATUSES.includes(row.status)}
              />
            ))}
          </InfiniteList>
        </>
      ) : (
        <EmptyState {...empty} className="flex-1" />
      )}
    </>
  );
}
