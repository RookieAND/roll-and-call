import { HStack, VStack } from "@roll-and-call/ui";

import { CancelNoShowDialog, NoShowSummary } from "@/features/cancel-no-show";
import { paginate, withQuery, type TableSort } from "@/shared/lib";
import {
  NO_SHOW_STATUS_LABEL,
  type NoShowDetail,
  type NoShowRow,
  type NoShowSortColumn,
} from "@/shared/server";
import { AdminHeader, EMPTY_IMAGE, ListPager, Panel, UrlSearchInput, UrlSelect } from "@/shared/ui";

import { NoShowsTable } from "./no-shows-table";

const STATUS_OPTIONS = Object.entries(NO_SHOW_STATUS_LABEL).map(([value, label]) => ({
  label,
  value,
}));

const EMPTY = {
  none: {
    title: "불참 기록이 없습니다",
    description: "GM이 출석 확인에서 불참을 기록하면 이곳에 표시됩니다.",
    image: EMPTY_IMAGE.schedule,
  },
  filtered: {
    title: "조건에 맞는 불참 기록이 없습니다",
    description: "검색어나 상태를 바꿔 보세요.",
    image: EMPTY_IMAGE.search,
  },
} as const;

interface NoShowsViewProps {
  rows: NoShowRow[];
  record: NoShowDetail | null;
  sort: TableSort<NoShowSortColumn>;
  query: Record<string, string | undefined>;
  filtered: boolean;
  page?: string;
}

export function NoShowsView({ rows, record, sort, query, filtered, page }: NoShowsViewProps) {
  const paged = paginate(rows, page);
  const hrefOf = (id: string | undefined) => withQuery("/noshow", query, { record: id });
  const empty = filtered ? EMPTY.filtered : EMPTY.none;

  return (
    <>
      <AdminHeader title="불참 기록" sub={`${rows.length}건`} />
      <VStack gap="150" className="flex-1 p-200">
        <HStack align="center" gap="100">
          <UrlSearchInput placeholder="닉네임 · 세션 검색" className="w-[240px]" />
          <UrlSelect
            param="status"
            allLabel="상태 전체"
            options={STATUS_OPTIONS}
            className="w-[140px]"
          />
        </HStack>
        <Panel
          className="flex-1"
          footer={
            <ListPager
              page={paged.page}
              totalPages={paged.totalPages}
              total={rows.length}
              unit="건"
            />
          }
        >
          <NoShowsTable
            rows={paged.rows}
            sort={sort}
            empty={empty}
            selectedId={record?.id}
            hrefOf={hrefOf}
          />
        </Panel>
      </VStack>
      <CancelNoShowDialog
        record={record}
        summary={record ? <NoShowSummary record={record} /> : null}
        closeHref={hrefOf(undefined)}
      />
    </>
  );
}
