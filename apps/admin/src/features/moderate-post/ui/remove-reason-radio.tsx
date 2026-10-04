import { Grid, HStack, Radio, RadioGroup, Text, VStack } from "@roll-and-call/ui";

import { REVIEW_REASON } from "@/shared/lib";

const REMOVE_REASONS = Object.values(REVIEW_REASON);

interface RemoveReasonRadioProps {
  value: string | null;
  disabled: boolean;
  onValueChange: (value: string) => void;
}

// 구인과 후기는 같은 조치 사유 6개를 쓴다(시안 MOD_REASONS). 운영진 기록용이다.
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
        onValueChange={(next) => onValueChange(next as string)}
        aria-labelledby="post-remove-reason-label"
        render={<Grid className="grid-cols-2 gap-x-200 gap-y-050" />}
      >
        {REMOVE_REASONS.map((reason) => (
          <Radio.Field key={reason}>
            <Radio.Root value={reason}>
              <Radio.Indicator />
            </Radio.Root>
            <Radio.Label>{reason}</Radio.Label>
          </Radio.Field>
        ))}
      </RadioGroup>
      <Text typography="body4" foreground="hint">
        운영진 기록에만 남고 사용자에게는 보이지 않습니다.
      </Text>
    </VStack>
  );
}
