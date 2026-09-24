import { Badge, Button, HStack, VStack } from "@roll-and-call/ui";
import { ArrowRight, Check, Mail, Quote } from "lucide-react";
import Link from "next/link";

import { formatDateTime, STAFF_ROLE_LABEL, withQuery } from "@/shared/lib";
import { retentionDaysLeft, type AuditEntryDetail } from "@/shared/server";
import { AdminHeader, Facts, ItemCard, Panel } from "@/shared/ui";

import { USER_VISIBLE_REASON_ACTIONS } from "../model/user-visible-reason-actions";
import { EntryMoreMenu } from "./entry-more-menu";
import { StateBox } from "./state-box";

interface AuditEntryViewProps {
  entry: AuditEntryDetail;
}

export function AuditEntryView({ entry }: AuditEntryViewProps) {
  const time = formatDateTime(entry.at);
  const reasonTitle = USER_VISIBLE_REASON_ACTIONS.includes(entry.action)
    ? "사용자에게 보인 사유"
    : "사유";
  const afterTone =
    entry.action.includes("제재") && !entry.action.includes("해제") ? "danger" : "normal";
  const actionLabel = entry.targetDetail ? `${entry.action} ${entry.targetDetail}` : entry.action;
  const sameTargetHref = withQuery("/log", {}, { target: entry.targetName });
  const related = entry.related ?? [];
  const daysLeft = retentionDaysLeft(entry);
  const retention = daysLeft === null ? "계속 보관" : `${daysLeft}일 남음`;

  return (
    <>
      <AdminHeader
        title={`${entry.action} · ${entry.targetName}`}
        sub={time}
        back={{ href: "/log", label: "활동 기록" }}
      />
      <VStack gap="150" className="flex-1 p-200">
        {entry.before && entry.after ? (
          <Panel title="조치 전후" bodyClassName="p-175">
            <HStack align="center" gap="125">
              <StateBox label="전" state={entry.before} />
              <ArrowRight size={16} aria-label="에서" className="shrink-0 text-hint" />
              <StateBox label="후" state={entry.after} tone={afterTone} />
            </HStack>
          </Panel>
        ) : null}
        <Panel title="사유와 메모" bodyClassName="p-150">
          <VStack gap="100">
            <ItemCard icon={Mail} tone="primary" title={reasonTitle} meta={entry.reasonTag}>
              {entry.reason || "—"}
            </ItemCard>
            {entry.staffMemo ? (
              <ItemCard
                icon={Quote}
                title="운영진 메모"
                tags={<Badge colorPalette="gray">사용자에게 안 보이는 메모</Badge>}
              >
                {entry.staffMemo}
              </ItemCard>
            ) : null}
          </VStack>
        </Panel>
        {related.length > 0 ? (
          <Panel title="함께 처리된 항목" bodyClassName="p-150">
            <VStack gap="100">
              {related.map((item) => (
                <ItemCard key={item} icon={Check} title={item} />
              ))}
            </VStack>
          </Panel>
        ) : null}
        <Panel
          title="조치 정보"
          right={
            entry.targetUserId ? (
              <EntryMoreMenu targetUserId={entry.targetUserId} sameTargetHref={sameTargetHref} />
            ) : (
              <Button
                variant="outline"
                colorPalette="gray"
                size="sm"
                render={<Link href={sameTargetHref} />}
              >
                같은 대상의 조치 보기
              </Button>
            )
          }
          bodyClassName="p-150"
        >
          <Facts
            columns={5}
            items={[
              { label: "조치", value: actionLabel, danger: afterTone === "danger" },
              { label: "보관", value: retention },
              { label: "대상", value: entry.targetName },
              {
                label: "처리한 운영진",
                value: entry.actor,
                sub: entry.actorRole ? STAFF_ROLE_LABEL[entry.actorRole] : undefined,
              },
              { label: "처리 시각", value: time },
            ]}
          />
        </Panel>
      </VStack>
    </>
  );
}
