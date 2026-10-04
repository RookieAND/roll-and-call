import { Text } from "@roll-and-call/ui";

// 처리 대기열 2종은 정렬하지 않는다(오래된 순 고정, D200). 건수 줄 오른쪽에 둔다.
export function SortFixedNote() {
  return (
    <Text typography="body4" foreground="hint" className="ml-auto whitespace-nowrap">
      오래된 순
    </Text>
  );
}
