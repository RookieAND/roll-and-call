import { Text } from "@roll-and-call/ui";

interface ListEndHintProps {
  loaded: number;
  total: number;
  unit?: string;
}

// 쪽 번호 대신 무한 스크롤을 쓰는 목록의 마지막 줄
export function ListEndHint({ loaded, total, unit = "건" }: ListEndHintProps) {
  const remaining = total - loaded;
  return (
    <Text
      typography="body4"
      foreground="hint"
      render={<p />}
      className="px-200 pt-200 pb-250 text-center"
    >
      {remaining > 0 ? `스크롤하면 ${remaining}${unit}을 더 불러옵니다` : "모두 불러왔습니다"}
    </Text>
  );
}
