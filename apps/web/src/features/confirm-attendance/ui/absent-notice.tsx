import { Text } from "@trpg/ui";

export function AbsentNotice() {
  return (
    <Text typography="body4" foreground="danger" className="block">
      불참으로 기록됩니다
    </Text>
  );
}
