import { Field, Text, Textarea, VStack } from "@roll-and-call/ui";

import { EBOOK_REJECT_REASONS, OTHER_REASON, REJECT_REASONS } from "@/shared/lib";

import { ReasonRadio } from "./reason-radio";

interface RejectPanelProps {
  ebook: boolean;
  reason: string;
  userReason: string;
  staffMemo: string;
  onReasonChange: (reason: string) => void;
  onUserReasonChange: (userReason: string) => void;
  onStaffMemoChange: (staffMemo: string) => void;
}

export function RejectPanel({
  ebook,
  reason,
  userReason,
  staffMemo,
  onReasonChange,
  onUserReasonChange,
  onStaffMemoChange,
}: RejectPanelProps) {
  const other = reason === OTHER_REASON;
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
          {ebook
            ? "판단하기 어려우면 [추가 확인이 필요합니다]를 고르고, 요청할 내용을 사유에 적어 주세요."
            : "사유를 선택해 주세요. 특정 사진에 문제가 있으면 사진 카드의 [문제 지정]을 눌러 함께 지정할 수 있습니다."}
        </Text>
      </VStack>
      <VStack gap="150" className="p-150">
        <ReasonRadio
          reasons={ebook ? EBOOK_REJECT_REASONS : REJECT_REASONS}
          value={reason}
          otherText={userReason}
          onValueChange={onReasonChange}
          onOtherTextChange={onUserReasonChange}
          label={ebook ? "전자책 반려 사유" : "반려 사유"}
        />
        {other ? (
          <Text typography="body4" foreground="hint">
            기타를 고르면 이 입력란이 사용자에게 보이는 사유가 되며, 입력해야 반려할 수 있습니다.
          </Text>
        ) : (
          <Field.Root
            label="사용자에게 보이는 사유"
            htmlFor="reject-user-reason"
            required
            description="입력한 사유는 신청자에게 그대로 보이고, 활동 기록에도 남습니다."
          >
            <Textarea
              id="reject-user-reason"
              rows={2}
              value={userReason}
              onChange={(event) => onUserReasonChange(event.target.value)}
            />
          </Field.Root>
        )}
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
