import { Grid, HStack, Text, VStack } from "@roll-and-call/ui";
import { compact, isNull } from "es-toolkit";
import { ArrowRight } from "lucide-react";

import { actionTone, auditLogHref, formatDateTime, STAFF_ROLE_LABEL } from "@/shared/lib";
import { retentionDaysLeft, STAFF_CHANNEL_RELATED, type AuditEntryDetail } from "@/shared/server";
import { AdminHeader, FactRows, FactSub, IconTile, Tag } from "@/shared/ui";

import { actionIcon } from "../model/action-icon";
import { USER_VISIBLE_REASON_ACTIONS } from "../model/user-visible-reason-actions";
import { EntryMoreMenu } from "./entry-more-menu";
import { EntrySection } from "./entry-section";
import { StateBox } from "./state-box";

interface AuditEntryViewProps {
  entry: AuditEntryDetail;
  listHref: string;
}

export function AuditEntryView({ entry, listHref }: AuditEntryViewProps) {
  const reasonTitle = USER_VISIBLE_REASON_ACTIONS.includes(entry.action)
    ? "사용자에게 보인 사유"
    : "사유";
  const tone = actionTone(entry.action);
  const afterTone = tone === "danger" ? "danger" : "normal";
  const actionLabel = entry.targetDetail ? `${entry.action} ${entry.targetDetail}` : entry.action;
  const sameTargetHref = auditLogHref(entry.subject.sameTarget);
  const related = entry.related;
  const daysLeft = retentionDaysLeft(entry);
  const staffChannelLabel =
    entry.staffChannelLine === STAFF_CHANNEL_RELATED.posted ? "글 올림" : "올리지 않음";
  const sideFacts = compact([
    isNull(daysLeft) ? null : { label: "보관", value: `${daysLeft}일 남음` },
    entry.staffChannelLine ? { label: "운영진 채널", value: staffChannelLabel } : null,
  ]);

  return (
    <>
      <AdminHeader
        title={`${entry.action} · ${entry.targetName}`}
        sub="조치 상세"
        trail={[{ href: listHref, label: "활동 기록" }]}
      />
      <VStack gap="150" className="mx-auto w-full max-w-[960px] flex-1 p-200">
        <section className="rounded-600 border border-gray-200 bg-surface">
          <HStack align="center" gap="150" className="px-200 py-175">
            <IconTile icon={actionIcon(entry.action)} tone={tone} size="xl" />
            <HStack align="center" gap="100" wrap className="min-w-0 flex-1">
              <Text typography="heading3" render={<h2 />}>
                {entry.targetName}
              </Text>
              <Tag tone={tone}>{actionLabel}</Tag>
            </HStack>
            <EntryMoreMenu
              subjectKind={entry.subject.kind}
              openPath={entry.subject.openPath}
              sameTargetHref={sameTargetHref}
            />
          </HStack>
          <Grid className="grid-cols-2 items-start gap-x-300 border-t border-(--rc-color-border-subtle) px-200 py-100">
            <FactRows
              labelWidth={80}
              items={[
                {
                  label: "처리한 운영진",
                  value: (
                    <>
                      {entry.actor}
                      {entry.actorKind === "platform" ? <Tag>플랫폼 관리자</Tag> : null}
                      {entry.actorKind === "staff" && entry.actorRole ? (
                        <FactSub>{STAFF_ROLE_LABEL[entry.actorRole]}</FactSub>
                      ) : null}
                    </>
                  ),
                },
                { label: "처리 시각", value: formatDateTime(entry.at) },
              ]}
            />
            {sideFacts.length ? <FactRows labelWidth={80} items={sideFacts} /> : null}
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
                      {entry.reason}
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
