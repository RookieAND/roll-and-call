import { HStack, Text, VStack } from "@roll-and-call/ui";
import { SearchX } from "lucide-react";

import { CancelNoShowDialog, NoShowSummary } from "@/features/cancel-no-show";
import { withQuery } from "@/shared/lib";
import {
  NO_SHOW_STATUSES,
  NO_SHOW_TIMINGS,
  type NoShowDetail,
  type NoShowRow,
} from "@/shared/server";
import { AdminHeader, EmptyState, Panel, UrlSearchInput, UrlSelect } from "@/shared/ui";

import { NoShowsTable } from "./no-shows-table";

interface NoShowsViewProps {
  rows: NoShowRow[];
  record: NoShowDetail | null;
  query: Record<string, string | undefined>;
}

export function NoShowsView({ rows, record, query }: NoShowsViewProps) {
  const hrefOf = (id: string | undefined) => withQuery("/noshow", query, { record: id });
  const emptyTitle =
    query.q || query.timing || query.status
      ? "조건에 맞는 불참 기록이 없어요"
      : "불참 기록이 없어요";
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
          right={
            <Text typography="body4" foreground="hint">
              행을 누르면 불참 취소 창이 열립니다
            </Text>
          }
          className="flex-1"
        >
          {rows.length > 0 ? (
            <NoShowsTable rows={rows} selectedId={record?.id} hrefOf={hrefOf} />
          ) : (
            <EmptyState icon={SearchX} title={emptyTitle} />
          )}
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
