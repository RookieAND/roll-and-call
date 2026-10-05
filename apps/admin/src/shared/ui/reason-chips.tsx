"use client";

import { OTHER_REASON_CODE } from "@roll-and-call/database/moderation/model";
import { Chip, Field, HStack, Text, Textarea, VStack } from "@roll-and-call/ui";
import { useId } from "react";

interface ReasonChipsProps {
  // 사유 코드 → 칩 글자. 코드 other를 고르면 입력란이 나타난다.
  reasons: Readonly<Record<string, string>>;
  value: string | null;
  otherText: string;
  onValueChange: (value: string) => void;
  onOtherTextChange: (text: string) => void;
  // 없으면 묶음 제목을 그리지 않고 aria-label로만 쓴다(FormSection 제목이 대신할 때).
  label?: string;
  ariaLabel?: string;
  otherLabel?: string;
  otherPlaceholder?: string;
  otherMaxLength?: number;
  help?: string;
  disabled?: boolean;
  // 선택지 글자를 굵게 하지 않는다(고른 것만 500). 후기 조치 창이 쓴다.
  regularWeight?: boolean;
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
  otherPlaceholder = "목록에 없는 사유를 적어 주세요",
  otherMaxLength,
  help,
  disabled,
  regularWeight = false,
}: ReasonChipsProps) {
  const labelId = useId();
  const otherId = useId();
  const otherEmpty = !otherText.trim();
  const chipWeight = (selected: boolean) => {
    if (!regularWeight) return undefined;
    return selected ? "font-medium" : "font-normal";
  };
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
          {Object.entries(reasons).map(([code, reasonLabel]) => (
            <Chip
              key={code}
              role="radio"
              aria-checked={value === code}
              selected={value === code}
              disabled={disabled}
              className={chipWeight(value === code)}
              onClick={() => onValueChange(code)}
            >
              {reasonLabel}
            </Chip>
          ))}
        </HStack>
      </VStack>
      {value === OTHER_REASON_CODE ? (
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
            placeholder={otherPlaceholder}
            maxLength={otherMaxLength}
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
