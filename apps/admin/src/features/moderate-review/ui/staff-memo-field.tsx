import { Field, Textarea } from "@roll-and-call/ui";

interface StaffMemoFieldProps {
  value: string;
  disabled: boolean;
  onValueChange: (value: string) => void;
}

export function StaffMemoField({ value, disabled, onValueChange }: StaffMemoFieldProps) {
  return (
    <Field.Root
      label="운영진 메모 (선택)"
      htmlFor="review-action-staff-memo"
      description="활동 기록에 남습니다."
    >
      <Textarea
        id="review-action-staff-memo"
        rows={2}
        value={value}
        disabled={disabled}
        placeholder="예: 신고 이후 표현을 고쳐서 문제없음"
        onChange={(event) => onValueChange(event.target.value)}
      />
    </Field.Root>
  );
}
