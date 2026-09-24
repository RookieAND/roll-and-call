import { Callout, Field, Textarea } from "@roll-and-call/ui";
import { ScrollText } from "lucide-react";

interface ReasonFieldsProps {
  placeholder: string;
  userReason: string;
  staffMemo: string;
  disabled: boolean;
  onUserReasonChange: (userReason: string) => void;
  onStaffMemoChange: (staffMemo: string) => void;
}

export function ReasonFields({
  placeholder,
  userReason,
  staffMemo,
  disabled,
  onUserReasonChange,
  onStaffMemoChange,
}: ReasonFieldsProps) {
  return (
    <>
      <Field.Root label="사용자에게 보여줄 사유" htmlFor="post-action-user-reason" required>
        <Textarea
          id="post-action-user-reason"
          rows={2}
          value={userReason}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(event) => onUserReasonChange(event.target.value)}
        />
      </Field.Root>
      <Field.Root label="운영진 메모 (사용자에게 안 보임)" htmlFor="post-action-staff-memo">
        <Textarea
          id="post-action-staff-memo"
          rows={2}
          value={staffMemo}
          disabled={disabled}
          placeholder="판단한 근거나 확인한 내용을 적어 주세요"
          onChange={(event) => onStaffMemoChange(event.target.value)}
        />
      </Field.Root>
      <Callout.Root colorPalette="gray" size="sm">
        <Callout.Icon>
          <ScrollText size={14} />
        </Callout.Icon>
        <Callout.Description>확정하면 활동 기록에 남습니다.</Callout.Description>
      </Callout.Root>
    </>
  );
}
