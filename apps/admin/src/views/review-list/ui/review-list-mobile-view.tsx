import { Button, Chip, VStack } from "@roll-and-call/ui";
import { X } from "lucide-react";

import {
  reviewListHref,
  REVIEW_LIST_TAB,
  REVIEW_SORT_COLUMN,
  type ReviewListTab,
  type ReviewSortColumn,
} from "@/entities/review";
import { type ReviewList } from "@/entities/review/server";
import { formatDateTime, SORT_DIR, withoutYear, withQuery, type TableSort } from "@/shared/lib";
import {
  AdminHeader,
  EmptyState,
  InfiniteList,
  ListRow,
  ListSortBar,
  MobileTitle,
  ServerLink,
  Tag,
  UrlFilterChips,
  UrlSearchInput,
} from "@/shared/ui";

import { reviewEmptyCopy } from "../model/review-empty-copy";
import { REVIEW_PHOTO_CHIPS } from "../model/review-photo-chips";
import { ReviewMobileTabs } from "./mobile/review-mobile-tabs";

const SORT_OPTIONS = [
  { label: "작성 최신순", column: REVIEW_SORT_COLUMN.createdAt, dir: SORT_DIR.desc },
  { label: "작성 오래된 순", column: REVIEW_SORT_COLUMN.createdAt, dir: SORT_DIR.asc },
  { label: "작성자 가나다순", column: REVIEW_SORT_COLUMN.author, dir: SORT_DIR.asc },
  { label: "작성자 역순", column: REVIEW_SORT_COLUMN.author, dir: SORT_DIR.desc },
];

interface ReviewListMobileViewProps {
  list: ReviewList;
  tab: ReviewListTab;
  sort: TableSort<ReviewSortColumn>;
  query: Record<string, string | undefined>;
}

export function ReviewListMobileView({ list, tab, sort, query }: ReviewListMobileViewProps) {
  const hidden = tab === REVIEW_LIST_TAB.hidden;
  const { resettable, ...empty } = reviewEmptyCopy({ list, hidden });
  const resetHref = reviewListHref({ hidden, query: { ...query, q: undefined, photo: undefined } });
  const withoutGameHref = reviewListHref({ hidden, query: { ...query, game: undefined } });
  const detailQuery = withQuery("", { tab: hidden ? tab : undefined, ...query }, {});
  const total = `${list.rows.length}건`;
  return (
    <>
      <AdminHeader title={<MobileTitle title="후기" sub={total} />} />
      <ReviewMobileTabs counts={list.counts} />
      <VStack gap="100" className="border-y border-gray-200 bg-surface px-200 py-150">
        <UrlSearchInput placeholder="작성자 · 구인 제목 검색" />
        {list.game ? (
          <Chip selected render={<ServerLink path={withoutGameHref} />} className="self-start">
            구인: {list.game.title}
            <X size={14} aria-label="구인 칩 지우기" />
          </Chip>
        ) : (
          <UrlFilterChips param="photo" options={REVIEW_PHOTO_CHIPS} allLabel="사진 전체" />
        )}
      </VStack>
      {list.rows.length ? (
        <>
          <ListSortBar total={total} sort={sort} options={SORT_OPTIONS} />
          <InfiniteList>
            {list.rows.map((row) => (
              <ListRow
                key={row.id}
                path={`/reviews/${row.id}${detailQuery}`}
                title={row.authorNickname}
                badges={
                  row.badges.length
                    ? row.badges.map((badge) => <Tag key={badge}>{badge}</Tag>)
                    : undefined
                }
                trailing={withoutYear(formatDateTime(row.createdAt))}
                description={row.firstLine}
                meta={
                  row.photoCount ? `${row.gameTitle} · 사진 ${row.photoCount}장` : row.gameTitle
                }
              />
            ))}
          </InfiniteList>
        </>
      ) : (
        <EmptyState
          {...empty}
          className="flex-1"
          action={
            resettable ? (
              <Button
                variant="outline"
                colorPalette="gray"
                className="h-11"
                render={<ServerLink path={resetHref} />}
              >
                필터 지우기
              </Button>
            ) : undefined
          }
        />
      )}
    </>
  );
}
