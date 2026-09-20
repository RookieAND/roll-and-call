import { Text } from "@trpg/ui";

interface CapacityValueProps {
  text: string;
}

// 셀 수 있는 값은 진하게 — 지금 몇 자리가 찼는지가 카드에서 제일 먼저 읽혀야 한다.
export function CapacityValue({ text }: CapacityValueProps) {
  return (
    <Text typography="body4" weight="bold" numeric>
      {text}
    </Text>
  );
}
