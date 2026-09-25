import { Badge, Grid, HStack, Text, VStack } from "@roll-and-call/ui";
import { ArrowRight } from "lucide-react";

import { actionTone, formatDateTime, STAFF_ROLE_LABEL, withQuery } from "@/shared/lib";
import { retentionDaysLeft, type AuditEntryDetail } from "@/shared/server";
import { AdminHeader, FactRows, FactSub, IconTile } from "@/shared/ui";

import { actionIcon } from "../model/action-icon";
import { USER_VISIBLE_REASON_ACTIONS } from "../model/user-visible-reason-actions";
import { EntryMoreMenu } from "./entry-more-menu";
import { EntrySection } from "./entry-section";
import { StateBox } from "./state-box";

interface AuditEntryViewProps {
  entry: AuditEntryDetail;
}

export function AuditEntryView({ entry }: AuditEntryViewProps) {
  const reasonTitle = USER_VISIBLE_REASON_ACTIONS.includes(entry.action)
    ? "사용자에게 보인 사유"
    : "사유";
  const tone = actionTone(entry.action);
  const afterTone =
    entry.action.includes("제재") && !entry.action.includes("해제") ? "danger" : "normal";
  const actionLabel = entry.targetDetail ? `${entry.action} ${entry.targetDetail}` : entry.action;
  const sameTargetHref = withQuery("/log", {}, { target: entry.targetName });
  const related = entry.related ?? [];
  const daysLeft = retentionDaysLeft(entry);

  return (
    <>
      <AdminHeader title={`${entry.action} · ${entry.targetName}`} sub="조치 상세" />
      <VStack gap="150" className="mx-auto w-full max-w-[960px] flex-1 p-200">
        <section className="rounded-600 border border-gray-200 bg-surface">
          <HStack align="center" gap="150" className="px-200 py-175">
            <IconTile icon={actionIcon(entry.action)} tone={tone} size="xl" />
            <HStack align="center" gap="100" wrap className="min-w-0 flex-1">
              <Text typography="heading3" render={<h2 />}>
                {entry.targetName}
              </Text>
              <Badge colorPalette={tone}>{actionLabel}</Badge>
            </HStack>
            <EntryMoreMenu targetUserId={entry.targetUserId} sameTargetHref={sameTargetHref} />
          </HStack>
          <Grid className="grid-cols-3 items-start gap-x-300 border-t border-(--rc-color-border-subtle) px-200 py-100">
            <FactRows
              labelWidth={80}
              items={[
                {
                  label: "처리한 운영진",
                  value: (
                    <>
                      {entry.actor}
                      {entry.actorRole ? (
                        <FactSub>{STAFF_ROLE_LABEL[entry.actorRole]}</FactSub>
                      ) : null}
                    </>
                  ),
                },
                { label: "처리 시각", value: formatDateTime(entry.at) },
              ]}
            />
            <FactRows
              labelWidth={48}
              items={[
                { label: "보관", value: daysLeft === null ? "계속 보관" : `${daysLeft}일 남음` },
              ]}
            />
            <FactRows labelWidth={48} items={[{ label: "대상", value: entry.targetName }]} />
          </Grid>
        </section>
        <div className="divide-y divide-(--rc-color-border-subtle) rounded-600 border border-gray-200 bg-surface">
          {entry.before && entry.after ? (
            <EntrySection title="조치 전후">
              <HStack align="center" gap="125">
                <StateBox label="조치 전" state={entry.before} />
                <ArrowRight size={16} aria-label="에서" className="shrink-0 text-hint" />
                <StateBox label="조치 후" state={entry.after} tone={afterTone} />
              </HStack>
            </EntrySection>
          ) : null}
          <EntrySection title="사유">
            <FactRows
              labelWidth={120}
              items={[
                {
                  label: reasonTitle,
                  value: (
                    <>
                      {entry.reason || "—"}
                      {entry.reasonTag ? <FactSub>{entry.reasonTag}</FactSub> : null}
                    </>
                  ),
                },
                ...(entry.staffMemo
                  ? [
                      {
                        label: "운영진 메모",
                        value: <span className="font-normal leading-[1.6]">{entry.staffMemo}</span>,
                      },
                    ]
                  : []),
              ]}
            />
          </EntrySection>
          {related.length > 0 ? (
            <EntrySection
              title="함께 처리된 항목"
              right={
                <Text typography="body4" foreground="hint">
                  {related.length}건
                </Text>
              }
            >
              <VStack render={<ul />} className="divide-y divide-(--rc-color-border-subtle)">
                {related.map((item) => (
                  <Text key={item} typography="body3" render={<li />} className="py-100">
                    {item}
                  </Text>
                ))}
              </VStack>
            </EntrySection>
          ) : null}
        </div>
      </VStack>
    </>
  );
}
