import { CONTENT_REASON } from "@roll-and-call/database/moderation/model";
import { Grid, HStack, Radio, RadioGroup, Text, VStack } from "@roll-and-call/ui";

interface RemoveReasonRadioProps {
  value: string | null;
  disabled: boolean;
  onValueChange: (value: string) => void;
}

// 구인 취소 사유(시안 MOD_REASONS). 운영진 기록용이다.
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
        {Object.entries(CONTENT_REASON).map(([code, label]) => (
          <Radio.Field key={code}>
            <Radio.Root value={code}>
              <Radio.Indicator />
            </Radio.Root>
            <Radio.Label>{label}</Radio.Label>
          </Radio.Field>
        ))}
      </RadioGroup>
      <Text typography="body4" foreground="hint">
        운영진 기록에만 남고 사용자에게는 보이지 않습니다.
      </Text>
    </VStack>
  );
}
