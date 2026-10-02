import { Grid, HStack, Radio, RadioGroup, Text, VStack } from "@roll-and-call/ui";

import { REVIEW_REASON, REVIEW_REASONS, type ReviewReason } from "@/shared/lib";

interface RemoveReasonRadioProps {
  value: ReviewReason | null;
  disabled: boolean;
  onValueChange: (value: ReviewReason) => void;
}

// 구인과 후기는 같은 사유 목록을 쓴다(시안 MOD_REASONS).
export function RemoveReasonRadio({ value, disabled, onValueChange }: RemoveReasonRadioProps) {
  return (
    <VStack gap="075">
      <HStack align="baseline" gap="075">
        <Text id="post-remove-reason-label" typography="body4" weight="bold">
          사유{" "}
          <Text typography="body4" foreground="danger" render={<span />}>
            *
          </Text>
        </Text>
        {value ? null : (
          <Text typography="body4" foreground="hint">
            사유를 고르면 확정할 수 있습니다
          </Text>
        )}
      </HStack>
      <RadioGroup
        value={value}
        disabled={disabled}
        onValueChange={(next) => onValueChange(next as ReviewReason)}
        aria-labelledby="post-remove-reason-label"
        render={<Grid className="grid-cols-2 gap-x-200 gap-y-075" />}
      >
        {REVIEW_REASONS.map((reason) => (
          <Radio.Field key={reason}>
            <Radio.Root value={reason}>
              <Radio.Indicator />
            </Radio.Root>
            <Radio.Label>{REVIEW_REASON[reason]}</Radio.Label>
          </Radio.Field>
        ))}
      </RadioGroup>
    </VStack>
  );
}
