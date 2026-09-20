import { Text } from "@trpg/ui";

export function TagInputFullNote({ max }: { max: number }) {
  return (
    <Text typography="body4" foreground="hint" render={<p />}>
      {max}개를 모두 채웠습니다. 지우면 더 넣을 수 있습니다.
    </Text>
  );
}
