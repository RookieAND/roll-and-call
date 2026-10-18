import { STAFF_CHANNEL_RELATED } from "@roll-and-call/database/audit/model";
import { Button, HStack, Text, VStack } from "@roll-and-call/ui";
import { compact, isNull } from "es-toolkit";
import { ArrowDown } from "lucide-react";

import { actionTone, auditLogHref, retentionDaysLeft } from "@/entities/audit";
import { type AuditEntryDetail } from "@/entities/audit/server";
import { formatFullDateTime, STAFF_ROLE_LABEL } from "@/shared/lib";
import { AdminHeader, KeyValueList, MobileActionBar, ServerLink, Tag } from "@/shared/ui";

import { SUBJECT_OPEN_ITEM } from "../model/subject-open-item";
import { USER_VISIBLE_REASON_ACTIONS } from "../model/user-visible-reason-actions";
import { EntryMoveSheet } from "./mobile/entry-move-sheet";
import { MobileChangeItem } from "./mobile/mobile-change-item";
import { MobileEntrySection } from "./mobile/mobile-entry-section";
import { MobileStateBox } from "./mobile/mobile-state-box";

interface AuditEntryMobileViewProps {
  entry: AuditEntryDetail;
  listHref: string;
}

export function AuditEntryMobileView({ entry, listHref }: AuditEntryMobileViewProps) {
  const reasonTitle = USER_VISIBLE_REASON_ACTIONS.includes(entry.action)
    ? "사용자에게 보인 사유"
    : "사유";
  const tone = actionTone(entry.action);
  const sameTargetHref = auditLogHref(entry.subject.sameTarget);
  const openItem = SUBJECT_OPEN_ITEM[entry.subject.kind];
  const changes = entry.after?.changes ?? [];
  const daysLeft = retentionDaysLeft(entry);
  const actorRole =
    entry.actorKind === "staff" && entry.actorRole ? ` · ${STAFF_ROLE_LABEL[entry.actorRole]}` : "";
  const staffChannelLabel =
    entry.staffChannelLine === STAFF_CHANNEL_RELATED.posted ? "글 올림" : "올리지 않음";
  const facts = compact([
    { label: "처리한 운영진", value: `${entry.actor}${actorRole}` },
    { label: "처리 시각", value: formatFullDateTime(entry.at) },
    { label: "대상", value: entry.targetName },
    entry.targetDetail ? { label: "세부", value: entry.targetDetail } : null,
    isNull(daysLeft) ? null : { label: "보관", value: `${daysLeft}일 남음` },
    entry.staffChannelLine ? { label: "운영진 채널", value: staffChannelLabel } : null,
  ]);
  const reasons = compact([
    {
      label: reasonTitle,
      value: entry.reasonTag ? `${entry.reason} · ${entry.reasonTag}` : entry.reason,
    },
    entry.staffMemo ? { label: "운영진 메모", value: entry.staffMemo } : null,
  ]);
  const moveItems = compact([
    openItem && entry.subject.openPath
      ? { label: openItem.label, href: entry.subject.openPath }
      : null,
    { label: "같은 대상의 조치 보기", href: sameTargetHref },
  ]);

  return (
    <>
      <AdminHeader title={entry.action} trail={[{ href: listHref, label: "활동 기록" }]} />
      <VStack gap="150" className="px-150 pt-150 pb-200">
        <MobileEntrySection>
          <HStack className="pb-025">
            <Tag tone={tone}>{entry.action}</Tag>
          </HStack>
          <KeyValueList items={facts} />
        </MobileEntrySection>
        {changes.length > 0 ? (
          <MobileEntrySection
            title="바뀐 내용"
            right={
              <Text typography="body4" foreground="hint">
                {changes.length}칸
              </Text>
            }
          >
            <VStack>
              {changes.map((change) => (
                <MobileChangeItem key={change.field} change={change} />
              ))}
            </VStack>
          </MobileEntrySection>
        ) : null}
        {entry.before && entry.after ? (
          <MobileEntrySection title="조치 전후">
            <VStack gap="100">
              <MobileStateBox label="조치 전" state={entry.before} />
              <ArrowDown size={16} aria-label="에서" className="self-center text-hint" />
              <MobileStateBox label="조치 후" state={entry.after} danger={tone === "danger"} />
            </VStack>
          </MobileEntrySection>
        ) : null}
        <MobileEntrySection title="사유">
          <KeyValueList items={reasons} />
        </MobileEntrySection>
        {entry.related.length > 0 ? (
          <MobileEntrySection
            title="함께 처리된 항목"
            right={
              <Text typography="body4" foreground="hint">
                {entry.related.length}건
              </Text>
            }
          >
            <VStack render={<ul />} className="divide-y divide-(--rc-color-border-subtle)">
              {entry.related.map((item) => (
                <Text key={item} typography="body3" render={<li />} className="py-100">
                  {item}
                </Text>
              ))}
            </VStack>
          </MobileEntrySection>
        ) : null}
      </VStack>
      <MobileActionBar>
        <HStack gap="100">
          <Button
            variant="outline"
            colorPalette="gray"
            size="lg"
            render={<ServerLink path={sameTargetHref} />}
            className="flex-1 text-body2"
          >
            대상 기록 보기
          </Button>
          {moveItems.length > 1 ? <EntryMoveSheet items={moveItems} /> : null}
        </HStack>
      </MobileActionBar>
    </>
  );
}
