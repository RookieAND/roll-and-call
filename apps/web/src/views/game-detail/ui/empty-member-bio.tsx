import { Text } from "@trpg/ui";

export function EmptyMemberBio() {
  return (
    <Text truncate typography="body4" foreground="hint">
      한 줄 소개가 없습니다.
    </Text>
  );
}
