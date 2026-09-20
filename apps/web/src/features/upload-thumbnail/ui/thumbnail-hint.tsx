import { Text } from "@trpg/ui";

export function ThumbnailHint() {
  return (
    <Text typography="body4" foreground="hint" render={<p />}>
      목록과 상세 맨 위에 쓰입니다. 없으면 기본 그라데이션이 들어갑니다.
    </Text>
  );
}
