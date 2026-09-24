import { Chip, HStack, Text, VStack } from "@roll-and-call/ui";
import { X } from "lucide-react";
import Link from "next/link";

import { paginate, withQuery } from "@/shared/lib";
import {
  AUDIT_ACTION_GROUPS,
  AUDIT_PERIODS,
  AUDIT_RETENTION_DAYS,
  EXPIRING_AUDIT_ACTIONS,
  type listAuditLog,
} from "@/shared/server";
import { AdminHeader, ListPager, Panel, UrlSearchInput, UrlSelect } from "@/shared/ui";

import { ActionFilter } from "./action-filter";
import { AuditLogTable } from "./audit-log-table";

interface AuditLogViewProps {
  log: Awaited<ReturnType<typeof listAuditLog>>;
  query: Record<string, string | undefined>;
}

// ?target=은 다른 화면의 [활동 기록에서 보기]가 넘기는 고정 대상, ?q=는 검색창 입력이다.
export function AuditLogView({ log, query }: AuditLogViewProps) {
  const clearTargetHref = withQuery("/log", query, { target: undefined, page: undefined });
  const paged = paginate(log.rows, query.page);
  const pager = (
    <ListPager page={paged.page} totalPages={paged.totalPages} total={log.rows.length} unit="건" />
  );

  return (
    <>
      <AdminHeader title="활동 기록" sub={`${log.rows.length}건`} />
      <VStack gap="150" className="flex-1 p-200">
        <HStack align="center" gap="100" wrap>
          {query.target ? (
            <Chip
              selected
              render={<Link href={clearTargetHref} scroll={false} aria-label="대상 필터 지우기" />}
            >
              대상 · {query.target}
              <X size={12} aria-hidden />
            </Chip>
          ) : (
            <UrlSearchInput placeholder="대상 닉네임 검색" className="w-[220px]" />
          )}
          <UrlSelect
            param="actor"
            allLabel="전체 운영진"
            options={log.actors.map((actor) => ({ label: actor, value: actor }))}
            className="w-[146px]"
          />
          <ActionFilter groups={AUDIT_ACTION_GROUPS} />
          <UrlSelect
            param="period"
            allLabel="전체 기간"
            options={AUDIT_PERIODS.map(({ label, value }) => ({ label, value }))}
            className="w-[128px]"
          />
        </HStack>
        <Panel className="flex-1" footer={pager}>
          <AuditLogTable rows={paged.rows} />
        </Panel>
        <Text typography="body4" foreground="hint">
          {EXPIRING_AUDIT_ACTIONS.join(", ")} 기록은 기록된 날부터 {AUDIT_RETENTION_DAYS}일이 지나면
          삭제됩니다. 그 밖의 조치 기록은 계속 보관합니다.
        </Text>
      </VStack>
    </>
  );
}
