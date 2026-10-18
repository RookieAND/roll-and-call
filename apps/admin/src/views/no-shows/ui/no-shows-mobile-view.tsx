import { Button, VStack } from "@roll-and-call/ui";

import {
  NO_SHOW_SORT_COLUMN,
  NO_SHOW_STATUS,
  NO_SHOW_STATUS_LABEL,
  type NoShowRow,
  type NoShowSortColumn,
} from "@/entities/no-show";
import type { NoShowDetail } from "@/entities/no-show/server";
import { formatFullDate, SORT_DIR, withoutYear, withQuery, type TableSort } from "@/shared/lib";
import {
  AdminHeader,
  EMPTY_IMAGE,
  EmptyState,
  InfiniteList,
  ListRow,
  ListSortBar,
  MobileDetailBar,
  MobileTitle,
  ServerLink,
  StatusBadges,
  UrlFilterChips,
  UrlSearchInput,
} from "@/shared/ui";

import { NO_SHOW_STATUS_CHIPS } from "../model/no-show-status-chips";
import { NoShowMobileDetail } from "./mobile/no-show-mobile-detail";

const SORT_OPTIONS = [
  { label: "불참 일시 최신순", column: NO_SHOW_SORT_COLUMN.at, dir: SORT_DIR.desc },
  { label: "불참 일시 오래된 순", column: NO_SHOW_SORT_COLUMN.at, dir: SORT_DIR.asc },
  { label: "불참 당사자 가나다순", column: NO_SHOW_SORT_COLUMN.nickname, dir: SORT_DIR.asc },
  { label: "불참 당사자 역순", column: NO_SHOW_SORT_COLUMN.nickname, dir: SORT_DIR.desc },
];

interface NoShowsMobileViewProps {
  rows: NoShowRow[];
  // 모바일은 기록을 시트 대신 상세 화면(?detail=)으로 연다. 취소·되돌리기는 ?record= 시트를 그대로 쓴다.
  detail: NoShowDetail | null;
  sort: TableSort<NoShowSortColumn>;
  query: Record<string, string | undefined>;
  filtered: boolean;
}

export function NoShowsMobileView({ rows, detail, sort, query, filtered }: NoShowsMobileViewProps) {
  if (detail) return <NoShowMobileDetail record={detail} query={query} />;
  const addHref = withQuery("/noshow", query, { add: "1", record: undefined });
  const empty = filtered
    ? {
        title: "조건에 맞는 불참 기록이 없습니다",
        description: "검색어나 상태를 바꿔 보세요.",
        image: EMPTY_IMAGE.search,
      }
    : {
        title: "불참 기록이 없습니다",
        description: "GM이 출석 확인에서 불참을 기록하면 이곳에 표시됩니다.",
        image: EMPTY_IMAGE.schedule,
      };
  return (
    <>
      <AdminHeader title={<MobileTitle title="불참 기록" sub={`${rows.length}건`} />} />
      <VStack gap="100" className="border-b border-gray-200 bg-surface px-200 py-150">
        <UrlSearchInput placeholder="닉네임 · 세션 검색" />
        <UrlFilterChips param="status" options={NO_SHOW_STATUS_CHIPS} />
      </VStack>
      {rows.length ? (
        <>
          <ListSortBar total={`${rows.length}건`} sort={sort} options={SORT_OPTIONS} />
          <InfiniteList>
            {rows.map((row) => {
              const cancelled = row.status === NO_SHOW_STATUS.cancelled;
              return (
                <ListRow
                  key={row.id}
                  path={withQuery("/noshow", query, { detail: row.id })}
                  title={row.nickname}
                  trailing={
                    cancelled ? (
                      <StatusBadges status={NO_SHOW_STATUS_LABEL.cancelled} />
                    ) : (
                      withoutYear(formatFullDate(row.startsAt))
                    )
                  }
                  description={row.sessionTitle}
                  meta={`GM ${row.gmNickname}`}
                  muted={cancelled}
                />
              );
            })}
          </InfiniteList>
        </>
      ) : (
        <EmptyState {...empty} className="flex-1" />
      )}
      <MobileDetailBar
        primary={
          <Button render={<ServerLink path={addHref} scroll={false} />}>불참 기록 추가</Button>
        }
      />
    </>
  );
}
