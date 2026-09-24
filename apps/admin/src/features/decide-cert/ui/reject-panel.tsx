import { Chip, Field, HStack, Text, Textarea, VStack } from "@roll-and-call/ui";

import { REJECT_REASONS } from "../model/reject-reasons";

interface RejectPanelProps {
  reasonTag: string;
  userReason: string;
  staffMemo: string;
  onReasonTagChange: (reasonTag: string) => void;
  onUserReasonChange: (userReason: string) => void;
  onStaffMemoChange: (staffMemo: string) => void;
}

export function RejectPanel({
  reasonTag,
  userReason,
  staffMemo,
  onReasonTagChange,
  onUserReasonChange,
  onStaffMemoChange,
}: RejectPanelProps) {
  return (
    <VStack
      render={<section aria-label="반려 사유" />}
      className="overflow-hidden rounded-600 border border-danger-600 bg-surface"
    >
      <VStack gap="050" className="border-b border-(--rc-color-border-subtle) px-150 pt-175 pb-150">
        <Text typography="heading3" render={<h2 />}>
          반려 사유
        </Text>
        <Text typography="body4" foreground="hint">
          사유를 선택해 주세요. 특정 사진에 문제가 있으면 사진을 눌러 함께 지정할 수 있습니다(선택).
        </Text>
      </VStack>
      <VStack gap="100" className="p-150">
        <Text typography="body4" weight="bold" id="reject-reason-label">
          사유 선택
        </Text>
        <HStack
          gap="075"
          wrap
          role="radiogroup"
          aria-labelledby="reject-reason-label"
          className="mb-025"
        >
          {REJECT_REASONS.map((reason) => (
            <Chip
              key={reason}
              role="radio"
              aria-checked={reason === reasonTag}
              selected={reason === reasonTag}
              onClick={() => onReasonTagChange(reason)}
            >
              {reason}
            </Chip>
          ))}
        </HStack>
        <Field.Root
          label="사용자에게 보이는 사유"
          htmlFor="reject-user-reason"
          required
          description="입력한 사유는 신청자에게 그대로 보이고, 활동 기록에도 남습니다."
        >
          <Textarea
            id="reject-user-reason"
            rows={3}
            value={userReason}
            onChange={(event) => onUserReasonChange(event.target.value)}
          />
        </Field.Root>
        <Field.Root label="운영진 메모 (사용자에게 안 보임)" htmlFor="reject-staff-memo">
          <Textarea
            id="reject-staff-memo"
            rows={1}
            value={staffMemo}
            placeholder="예: 같은 사유로 두 번째 반려입니다"
            onChange={(event) => onStaffMemoChange(event.target.value)}
          />
        </Field.Root>
      </VStack>
    </VStack>
  );
}
