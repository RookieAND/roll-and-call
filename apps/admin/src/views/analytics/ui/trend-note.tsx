import { Text } from "@roll-and-call/ui";

export function TrendNote() {
  return (
    <Text typography="body4" foreground="hint" render={<p />} className="mb-100 text-right">
      시간이 정해지지 않은 구인은 모집 마감일 또는 조율 범위 끝 주에 둡니다.
    </Text>
  );
}
