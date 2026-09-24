import { HStack, VStack } from "@roll-and-call/ui";

import { CancelNoShowDialog, NoShowSummary } from "@/features/cancel-no-show";
import { paginate, withQuery } from "@/shared/lib";
import {
  NO_SHOW_STATUSES,
  NO_SHOW_TIMINGS,
  type NoShowDetail,
  type NoShowRow,
} from "@/shared/server";
import { AdminHeader, EMPTY_IMAGE, ListPager, Panel, UrlSearchInput, UrlSelect } from "@/shared/ui";

import { NoShowsTable } from "./no-shows-table";

interface NoShowsViewProps {
  rows: NoShowRow[];
  record: NoShowDetail | null;
  query: Record<string, string | undefined>;
  page?: string;
}

export function NoShowsView({ rows, record, page, query }: NoShowsViewProps) {
  const paged = paginate(rows, page);
  const hrefOf = (id: string | undefined) =>
    withQuery("/noshow", { ...query, page }, { record: id });
  const filtered = Boolean(query.q || query.timing || query.status);
  const timingOptions = Object.entries(NO_SHOW_TIMINGS).map(([value, label]) => ({ label, value }));
  const statusOptions = Object.entries(NO_SHOW_STATUSES).map(([value, label]) => ({
    label,
    value,
  }));
  const currentIndex = rows.findIndex((row) => row.id === record?.id);
  const nextRecord = [...rows.slice(currentIndex + 1), ...rows.slice(0, currentIndex + 1)].find(
    (row) => !row.cancelled && row.id !== record?.id,
  );

  return (
    <>
      <AdminHeader title="불참 기록" sub={`${rows.length}건`} />
      <VStack gap="150" className="flex-1 p-200">
        <HStack align="center" gap="100">
          <UrlSearchInput placeholder="닉네임 · 세션 검색" className="w-[240px]" />
          <UrlSelect
            param="timing"
            allLabel="처리 시점 전체"
            options={timingOptions}
            className="w-[150px]"
          />
          <UrlSelect
            param="status"
            allLabel="상태 전체"
            options={statusOptions}
            className="w-[124px]"
          />
        </HStack>
        <Panel
          title="최신순"
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
            emptyTitle={filtered ? "조건에 맞는 불참 기록이 없어요" : "불참 기록이 없어요"}
            emptyImage={filtered ? EMPTY_IMAGE.search : EMPTY_IMAGE.schedule}
            selectedId={record?.id}
            hrefOf={hrefOf}
          />
        </Panel>
      </VStack>
      <CancelNoShowDialog
        record={record}
        summary={record ? <NoShowSummary record={record} /> : null}
        closeHref={hrefOf(undefined)}
        nextRecordHref={nextRecord ? hrefOf(nextRecord.id) : null}
      />
    </>
  );
}
