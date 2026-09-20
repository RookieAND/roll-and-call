import { Text } from "@trpg/ui";

export function LockedRosterNote() {
  return (
    <Text typography="body4" foreground="hint" render={<p />}>
      세션이 끝난 뒤에는 명단을 고칠 수 없습니다.
      <br />
      왔는지 안 왔는지만 출석 확인에서 정합니다.
    </Text>
  );
}
