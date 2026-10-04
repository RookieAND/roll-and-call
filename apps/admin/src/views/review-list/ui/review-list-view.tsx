import { Button, Chip, HStack, VStack } from "@roll-and-call/ui";
import { X } from "lucide-react";

import { reviewListHref, withQuery, type TableSort } from "@/shared/lib";
import {
  REVIEW_LIST_TAB,
  REVIEW_PHOTO_FILTER,
  type ReviewList,
  type ReviewListTab,
  type ReviewSortColumn,
} from "@/shared/server";
import { AdminHeader, Panel, ServerLink, UrlSearchInput, UrlSelect } from "@/shared/ui";

import { reviewEmptyCopy } from "../model/review-empty-copy";
import { ReviewTable } from "./review-table";
import { ReviewTabs } from "./review-tabs";

const PHOTO_OPTIONS = [
  { label: "사진 있음", value: REVIEW_PHOTO_FILTER.with },
  { label: "사진 없음", value: REVIEW_PHOTO_FILTER.without },
];

interface ReviewListViewProps {
  list: ReviewList;
  tab: ReviewListTab;
  sort: TableSort<ReviewSortColumn>;
  // 들어온 목록의 검색·사진·구인 칩·정렬(q, photo, game, sort, dir). 상세 주소에 그대로 싣는다.
  query: Record<string, string | undefined>;
}

export function ReviewListView({ list, tab, sort, query }: ReviewListViewProps) {
  const hidden = tab === REVIEW_LIST_TAB.hidden;
  const total = hidden ? list.counts.hidden : list.counts.all;
  const headerSub = `${hidden ? "숨긴 후기" : "전체 후기"} ${total}건`;
  const { resettable, ...empty } = reviewEmptyCopy({ list, hidden });
  const resetHref = reviewListHref({ hidden, query: { ...query, q: undefined, photo: undefined } });
  const withoutGameHref = reviewListHref({ hidden, query: { ...query, game: undefined } });
  const detailQuery = withQuery("", { tab: hidden ? tab : undefined, ...query }, {});
  const resetAction = resettable ? (
    <Button
      variant="outline"
      colorPalette="gray"
      size="sm"
      render={<ServerLink path={resetHref} />}
    >
      필터 초기화
    </Button>
  ) : undefined;

  return (
    <>
      <AdminHeader title="후기" sub={headerSub} />
      <ReviewTabs counts={list.counts} />
      <VStack gap="150" className="flex-1 p-200">
        <HStack align="center" gap="100" wrap>
          <UrlSearchInput placeholder="작성자 · 구인 제목 검색" className="w-[236px]" />
          <UrlSelect
            param="photo"
            allLabel="사진 전체"
            options={PHOTO_OPTIONS}
            className="w-[150px]"
          />
          {list.game ? (
            <Chip selected render={<ServerLink path={withoutGameHref} />}>
              구인: {list.game.title}
              <X size={14} aria-label="구인 칩 지우기" />
            </Chip>
          ) : null}
        </HStack>
        <Panel>
          <ReviewTable
            rows={list.rows}
            sort={sort}
            gameChip={Boolean(list.game)}
            empty={{ ...empty, action: resetAction }}
            detailQuery={detailQuery}
          />
        </Panel>
      </VStack>
    </>
  );
}
