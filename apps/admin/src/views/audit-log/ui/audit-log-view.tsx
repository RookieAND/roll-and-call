import { Chip, HStack, Text, VStack } from "@roll-and-call/ui";
import { X } from "lucide-react";

import { formatDateTime, paginate, withQuery } from "@/shared/lib";
import {
  AUDIT_ACTION_GROUPS,
  AUDIT_PERIODS,
  DEFAULT_AUDIT_PERIOD,
  type listAuditLog,
} from "@/shared/server";
import {
  AdminHeader,
  CsvExportButton,
  ListPager,
  Panel,
  ServerLink,
  UrlSearchInput,
  UrlSelect,
} from "@/shared/ui";

import { RETENTION_NOTE } from "../model/retention-note";
import { ActionFilter } from "./action-filter";
import { AuditLogTable } from "./audit-log-table";

interface AuditLogViewProps {
  log: Awaited<ReturnType<typeof listAuditLog>>;
  query: Record<string, string | undefined>;
}

export function AuditLogView({ log, query }: AuditLogViewProps) {
  const clearTargetHref = withQuery("/log", query, { target: undefined, page: undefined });
  const paged = paginate(log.rows, query.page);
  const filteredByTarget = Boolean(query.target);
  const showPager = !filteredByTarget || paged.totalPages > 1;
  const pager = showPager ? (
    <ListPager page={paged.page} totalPages={paged.totalPages} total={log.rows.length} unit="건" />
  ) : null;

  return (
    <>
      <AdminHeader title="활동 기록" sub={`${log.rows.length}건`} />
      <VStack gap="150" className="flex-1 p-200">
        <HStack align="center" gap="100">
          <HStack align="center" gap="100" wrap>
            {filteredByTarget ? (
              <Chip
                selected
                render={
                  <ServerLink path={clearTargetHref} scroll={false} aria-label="대상 필터 지우기" />
                }
              >
                대상 · {query.target}
                <X size={12} aria-hidden />
              </Chip>
            ) : (
              <>
                <UrlSearchInput placeholder="대상 닉네임 검색" className="w-[220px]" />
                <UrlSelect
                  param="actor"
                  allLabel="전체 운영진"
                  options={log.actors.map((actor) => ({ label: actor, value: actor }))}
                  className="w-[146px]"
                />
              </>
            )}
            <ActionFilter groups={AUDIT_ACTION_GROUPS} />
            <UrlSelect
              param="period"
              allLabel="전체 기간"
              options={AUDIT_PERIODS.map(({ label, value }) => ({ label, value }))}
              defaultValue={filteredByTarget ? undefined : DEFAULT_AUDIT_PERIOD}
              className="w-[128px]"
            />
          </HStack>
          {filteredByTarget ? null : (
            <div className="ml-auto">
              <CsvExportButton
                fileName="활동 기록.csv"
                header={["일시", "조치", "대상", "사유", "운영진"]}
                rows={log.rows.map((row) => [
                  formatDateTime(row.at),
                  row.action,
                  row.target,
                  row.reason,
                  row.actor,
                ])}
              />
            </div>
          )}
        </HStack>
        <Panel footer={pager}>
          <AuditLogTable rows={paged.rows} />
        </Panel>
        {filteredByTarget ? null : (
          <Text typography="body4" foreground="hint">
            {RETENTION_NOTE}
          </Text>
        )}
      </VStack>
    </>
  );
}
