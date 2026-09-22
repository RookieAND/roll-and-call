import { Text } from "@roll-and-call/ui";

interface TagInputFullNoteProps {
  max: number;
}

export function TagInputFullNote({ max }: TagInputFullNoteProps) {
  return (
    <Text typography="body4" foreground="hint" render={<p />}>
      {max}개를 모두 채웠습니다. 지우면 더 넣을 수 있습니다.
    </Text>
  );
}
