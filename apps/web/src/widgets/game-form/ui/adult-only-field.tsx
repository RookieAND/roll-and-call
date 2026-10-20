import { Field, SegmentedControl, Text, VStack } from "@roll-and-call/ui";

const ADULT_ONLY = { off: "off", on: "on" } as const;

const HINT = "목록과 상세에 성인 전용 표시가 붙습니다.";

interface AdultOnlyFieldProps {
  value: boolean;
  onChange: (next: boolean) => void;
}

export function AdultOnlyField({ value, onChange }: AdultOnlyFieldProps) {
  const selected = value ? ADULT_ONLY.on : ADULT_ONLY.off;
  return (
    <Field.Root label="성인 전용" required>
      <VStack gap="100">
        <SegmentedControl.Root
          value={selected}
          onValueChange={(next) => onChange(next === ADULT_ONLY.on)}
          aria-label="성인 전용"
        >
          <SegmentedControl.Item value={ADULT_ONLY.off}>전체 이용가</SegmentedControl.Item>
          <SegmentedControl.Item value={ADULT_ONLY.on}>성인 전용</SegmentedControl.Item>
        </SegmentedControl.Root>
        <Text typography="body4" foreground="hint" render={<p />}>
          {HINT}
        </Text>
      </VStack>
    </Field.Root>
  );
}
