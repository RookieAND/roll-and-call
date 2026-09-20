import { Text } from "@trpg/ui";

export function PickSlotHint() {
  return (
    <Text typography="body4" foreground="hint" render={<p />}>
      칸을 누르면 그 시간에 가능한 사람이 보입니다.
    </Text>
  );
}
