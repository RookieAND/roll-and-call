import { Text } from "@roll-and-call/ui";

// 표의 빈 값. 모든 열에서 회색 「—」다.
export function EmptyDash() {
  return (
    <Text typography="body3" foreground="hint" render={<span />}>
      —
    </Text>
  );
}
