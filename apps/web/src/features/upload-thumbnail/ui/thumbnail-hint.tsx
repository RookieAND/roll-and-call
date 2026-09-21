import { Text } from "@trpg/ui";

export function ThumbnailHint() {
  return (
    <Text typography="body4" foreground="hint" render={<p />}>
      구인 목록과 상세 맨 위에 보입니다. 올리지 않으면 기본 이미지가 쓰입니다.
    </Text>
  );
}
