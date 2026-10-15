"use client";

import {
  Collapsible,
  Field,
  HStack,
  RadioCard,
  RadioGroup,
  Text,
  Textarea,
  TextInput,
  VStack,
} from "@roll-and-call/ui";
import { ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";

import { EBOOK_REJECT_REASONS, REJECT_REASONS } from "@/entities/cert";
import { NotificationPreview } from "@/entities/notification";
import { appliedRulebookLabel } from "@/entities/rulebook";
import { OTHER_REASON } from "@/shared/lib";

import { MOBILE_REJECT_SECTION_ID } from "../model/section-ids";

interface MobileRejectPanelProps {
  ebook: boolean;
  reason: string;
  userReason: string;
  staffMemo: string;
  targetLabels: string[];
  previewPayload: ComponentProps<typeof NotificationPreview>["payload"];
  approvePreviewPayload: ComponentProps<typeof NotificationPreview>["payload"];
  onReasonChange: (reason: string) => void;
  onUserReasonChange: (userReason: string) => void;
  onStaffMemoChange: (staffMemo: string) => void;
}

// 사유는 한 열 카드로 고른다. 알림 미리보기는 접힌 한 줄로 둔다.
export function MobileRejectPanel({
  ebook,
  reason,
  userReason,
  staffMemo,
  targetLabels,
  previewPayload,
  approvePreviewPayload,
  onReasonChange,
  onUserReasonChange,
  onStaffMemoChange,
}: MobileRejectPanelProps) {
  const other = reason === OTHER_REASON;
  const reasons = ebook ? EBOOK_REJECT_REASONS : REJECT_REASONS;
  return (
    <VStack
      render={<section id={MOBILE_REJECT_SECTION_ID} aria-label="반려 사유" />}
      className="overflow-hidden rounded-600 border border-danger-600 bg-surface"
    >
      <VStack gap="050" className="px-150 pt-150 pb-100">
        <Text typography="heading3" render={<h2 />}>
          반려 사유
        </Text>
        {targetLabels.length > 0 ? (
          <Text typography="body4" weight="bold" foreground="danger" className="break-keep">
            {`반려 대상 · ${appliedRulebookLabel({ rulebook: targetLabels[0]!, groupBookCount: targetLabels.length })}`}
          </Text>
        ) : null}
        <Text typography="body4" foreground="muted">
          사유를 고르면 사용자에게 보이는 문구가 미리 채워집니다. 문구는 고칠 수 있습니다.
        </Text>
      </VStack>
      <VStack gap="125" className="p-150 pt-050">
        <RadioGroup
          value={reason || null}
          onValueChange={(next) => onReasonChange(next as string)}
          aria-label={ebook ? "전자책 반려 사유" : "반려 사유"}
          className="flex flex-col gap-075"
        >
          {reasons.map((candidate) => (
            <RadioCard.Root
              key={candidate.name}
              value={candidate.name}
              className="min-h-12 px-150 py-125"
            >
              <RadioCard.Title>{candidate.name}</RadioCard.Title>
              <RadioCard.Indicator />
            </RadioCard.Root>
          ))}
        </RadioGroup>
        {other ? (
          <Field.Root
            label="사용자에게 보이는 사유"
            htmlFor="mobile-reject-other"
            required
            description="기타를 고르면 이 입력란이 사용자에게 보이는 사유가 되며, 입력해야 반려할 수 있습니다."
          >
            <TextInput
              id="mobile-reject-other"
              value={userReason}
              enterKeyHint="done"
              placeholder="사용자에게 보이는 사유를 직접 적어 주세요"
              onChange={(event) => onUserReasonChange(event.target.value)}
            />
          </Field.Root>
        ) : (
          <Field.Root
            label="사용자에게 보이는 사유"
            htmlFor="mobile-reject-user-reason"
            required
            description="신청자에게 그대로 보이고, 활동 기록에도 남습니다."
          >
            <Textarea
              id="mobile-reject-user-reason"
              rows={3}
              value={userReason}
              enterKeyHint="done"
              onChange={(event) => onUserReasonChange(event.target.value)}
            />
          </Field.Root>
        )}
        <Field.Root label="운영진 메모 (사용자에게 안 보임)" htmlFor="mobile-reject-staff-memo">
          <Textarea
            id="mobile-reject-staff-memo"
            rows={2}
            value={staffMemo}
            enterKeyHint="done"
            placeholder="예: 같은 사유로 두 번째 반려입니다"
            onChange={(event) => onStaffMemoChange(event.target.value)}
          />
        </Field.Root>
        <Collapsible.Root>
          <Collapsible.Trigger className="flex min-h-12 w-full items-center gap-100 rounded-600 border border-gray-200 px-150 text-left">
            <Text typography="body3" weight="bold" className="flex-1">
              알림 미리보기
            </Text>
            <Text typography="body4" foreground="muted">
              신청자의 알림 탭
            </Text>
            <ChevronDown size={16} aria-hidden className="text-hint" />
          </Collapsible.Trigger>
          <Collapsible.Panel>
            <HStack className="pt-100">
              <NotificationPreview
                payload={previewPayload}
                precedingPayloads={approvePreviewPayload ? [approvePreviewPayload] : []}
                recipients="신청자의 알림 탭으로 알립니다."
              />
            </HStack>
          </Collapsible.Panel>
        </Collapsible.Root>
      </VStack>
    </VStack>
  );
}
