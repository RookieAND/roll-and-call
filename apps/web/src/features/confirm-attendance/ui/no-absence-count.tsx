import { Text } from "@trpg/ui";

// 불참이 0이면 아무 일도 없었다는 뜻이라 색을 붙이지 않는다.
export function NoAbsenceCount() {
  return (
    <Text typography="subtitle1" foreground="muted">
      불참 0명
    </Text>
  );
}
