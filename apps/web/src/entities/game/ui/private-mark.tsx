import { Text } from "@roll-and-call/ui";

// 지정 모집 구인의 표시. 배지가 아니라 글자이고, 한 줄 라벨이라 줄바꿈하지 않는다.
export function PrivateMark() {
  return (
    <Text typography="body5" foreground="hint" render={<span />} className="whitespace-nowrap">
      지정 모집
    </Text>
  );
}
