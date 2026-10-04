"use client";

import { Chip, Field, HStack, Text, Textarea, VStack } from "@roll-and-call/ui";
import { useId } from "react";

import { OTHER_REASON } from "@/shared/lib";

interface ReasonChipsProps {
  // 칩 목록. 마지막에 「기타」가 있으면 고를 때 입력란이 나타난다.
  reasons: readonly string[];
  value: string | null;
  otherText: string;
  onValueChange: (value: string) => void;
  onOtherTextChange: (text: string) => void;
  // 없으면 묶음 제목을 그리지 않고 aria-label로만 쓴다(FormSection 제목이 대신할 때).
  label?: string;
  ariaLabel?: string;
  otherLabel?: string;
  help?: string;
  disabled?: boolean;
}

// 조치 사유 칩(시안 ReasonChips). 한 번에 하나만 고르고 기본값은 없다.
export function ReasonChips({
  reasons,
  value,
  otherText,
  onValueChange,
  onOtherTextChange,
  label,
  ariaLabel,
  otherLabel = "기타 사유",
  help,
  disabled,
}: ReasonChipsProps) {
  const labelId = useId();
  const otherId = useId();
  const otherEmpty = !otherText.trim();
  return (
    <VStack gap="125">
      <VStack gap="075">
        {label ? (
          <Text id={labelId} typography="body4" weight="bold">
            {label}
            <Text typography="body4" foreground="danger" render={<span />}>
              {" *"}
            </Text>
          </Text>
        ) : null}
        <HStack
          role="radiogroup"
          aria-labelledby={label ? labelId : undefined}
          aria-label={label ? undefined : ariaLabel}
          gap="075"
          wrap
        >
          {reasons.map((reason) => (
            <Chip
              key={reason}
              role="radio"
              aria-checked={value === reason}
              selected={value === reason}
              disabled={disabled}
              onClick={() => onValueChange(reason)}
            >
              {reason}
            </Chip>
          ))}
        </HStack>
      </VStack>
      {value === OTHER_REASON ? (
        <Field.Root
          label={otherLabel}
          htmlFor={otherId}
          required
          description={otherEmpty ? "입력해야 확정할 수 있습니다." : undefined}
          className="p-025"
        >
          <Textarea
            id={otherId}
            rows={2}
            placeholder="목록에 없는 사유를 적어 주세요"
            value={otherText}
            disabled={disabled}
            onChange={(event) => onOtherTextChange(event.target.value)}
          />
        </Field.Root>
      ) : null}
      {help ? (
        <Text typography="body4" foreground="hint">
          {help}
        </Text>
      ) : null}
    </VStack>
  );
}
