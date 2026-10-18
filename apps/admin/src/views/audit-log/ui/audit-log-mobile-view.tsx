import { AUDIT_ACTION_GROUPS } from "@roll-and-call/database/audit/model";
import { Button, Chip, Grid, VStack } from "@roll-and-call/ui";
import { X } from "lucide-react";

import { ALL_AUDIT_PERIOD, defaultAuditPeriod } from "@/entities/audit";
import { type listAuditLog } from "@/entities/audit/server";
import { SORT_DIR, withQuery, type TableSort } from "@/shared/lib";
import {
  AdminHeader,
  EMPTY_IMAGE,
  EmptyState,
  ListRow,
  ListSortBar,
  InfiniteList,
  ServerLink,
  UrlSearchInput,
  UrlSelect,
} from "@/shared/ui";

import { logRowTime } from "../model/log-row-time";
import { ActionKindSheet } from "./mobile/action-kind-sheet";
import { PeriodChips } from "./mobile/period-chips";

interface AuditLogMobileViewProps {
  log: Awaited<ReturnType<typeof listAuditLog>>;
  query: Record<string, string | undefined>;
  sort: TableSort<"at">;
}

const SORT_OPTIONS = [
  { label: "최신순", column: "at", dir: SORT_DIR.desc },
  { label: "일시 오래된 순", column: "at", dir: SORT_DIR.asc },
];

export function AuditLogMobileView({ log, query, sort }: AuditLogMobileViewProps) {
  const filteredByTarget = Boolean(query.target || query.targetUser || query.targetGame);
  const scoped = filteredByTarget || Boolean(query.q);
  const periodLimited = log.period !== ALL_AUDIT_PERIOD;
  const clearTargetHref = withQuery("/log", query, {
    target: undefined,
    targetUser: undefined,
    targetGame: undefined,
    page: undefined,
  });
  const allPeriodHref = withQuery("/log", query, { period: ALL_AUDIT_PERIOD, page: undefined });
  const listQuery = withQuery("", query, {});
  const now = new Date();
  const rows = log.rows.map((row) => (
    <ListRow
      key={row.id}
      path={`/log/${row.id}${listQuery}`}
      title={row.action}
      trailing={logRowTime(row.at, now)}
      description={row.target}
      meta={`${row.actor} 처리`}
    />
  ));
  const emptyTitle = periodLimited
    ? "선택한 기간에 맞는 기록이 없습니다"
    : "조건에 맞는 활동 기록이 없습니다";
  const emptyDescription = periodLimited
    ? "기간을 전체로 바꾸면 더 오래된 기록도 볼 수 있습니다."
    : "검색어나 조치를 바꿔 보세요.";

  return (
    <>
      <AdminHeader title="활동 기록" />
      <VStack gap="100" className="border-b border-gray-200 bg-surface px-200 py-150">
        {filteredByTarget ? (
          <Chip
            selected
            render={
              <ServerLink path={clearTargetHref} scroll={false} aria-label="대상 필터 지우기" />
            }
            className="min-h-11 self-start"
          >
            대상: {log.targetName}
            <X size={12} aria-hidden />
          </Chip>
        ) : (
          <>
            <UrlSearchInput placeholder="대상 닉네임 검색" />
            <Grid cols={2} className="gap-100">
              <UrlSelect
                param="actor"
                allLabel="전체 운영진"
                options={log.actors.map((actor) => ({ label: actor, value: actor }))}
                className="min-w-0"
              />
              <ActionKindSheet groups={AUDIT_ACTION_GROUPS} />
            </Grid>
          </>
        )}
        <PeriodChips defaultPeriod={defaultAuditPeriod({ scoped })} />
      </VStack>
      <ListSortBar total={`${log.rows.length}건`} sort={sort} options={SORT_OPTIONS} />
      {rows.length ? (
        <InfiniteList>{rows}</InfiniteList>
      ) : (
        <EmptyState
          image={EMPTY_IMAGE.search}
          title={emptyTitle}
          description={emptyDescription}
          action={
            periodLimited ? (
              <Button
                variant="outline"
                colorPalette="gray"
                render={<ServerLink path={allPeriodHref} scroll={false} />}
                className="min-h-11"
              >
                전체 기간으로 보기
              </Button>
            ) : null
          }
          className="flex-1"
        />
      )}
    </>
  );
}
