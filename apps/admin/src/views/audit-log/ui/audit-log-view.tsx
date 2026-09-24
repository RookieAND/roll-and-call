import { Chip, HStack, VStack } from "@roll-and-call/ui";
import { SearchX, X } from "lucide-react";
import Link from "next/link";

import { withQuery } from "@/shared/lib";
import { AUDIT_ACTION_GROUPS, AUDIT_PERIODS, type listAuditLog } from "@/shared/server";
import { AdminHeader, EmptyState, Panel, UrlSearchInput, UrlSelect } from "@/shared/ui";

import { ActionFilter } from "./action-filter";
import { AuditLogTable } from "./audit-log-table";

interface AuditLogViewProps {
  log: Awaited<ReturnType<typeof listAuditLog>>;
  query: Record<string, string | undefined>;
}

// ?target=은 다른 화면의 [활동 기록에서 보기]가 넘기는 고정 대상, ?q=는 검색창 입력이다.
export function AuditLogView({ log, query }: AuditLogViewProps) {
  const clearTargetHref = withQuery("/log", query, { target: undefined });

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
        <Panel title="최신순" className="flex-1">
          {log.rows.length > 0 ? (
            <AuditLogTable rows={log.rows} />
          ) : (
            <EmptyState icon={SearchX} title="조건에 맞는 활동 기록이 없어요" />
          )}
        </Panel>
      </VStack>
    </>
  );
}
