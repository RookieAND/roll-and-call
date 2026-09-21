import { Text } from "@trpg/ui";

interface LockedRosterNoteProps {
  attendanceChecked: boolean;
}

export function LockedRosterNote({ attendanceChecked }: LockedRosterNoteProps) {
  return (
    <Text typography="body4" foreground="hint" render={<p />}>
      {attendanceChecked ? (
        <>
          출석을 확정하면 되돌릴 수 없습니다.
          <br />
          세션이 끝난 뒤에는 명단도 고칠 수 없습니다.
        </>
      ) : (
        <>
          세션이 끝난 뒤에는 명단을 고칠 수 없습니다.
          <br />
          왔는지 안 왔는지만 출석 확인에서 정합니다.
        </>
      )}
    </Text>
  );
}
