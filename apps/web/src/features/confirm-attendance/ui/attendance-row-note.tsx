import { Text } from "@roll-and-call/ui";

import type { Attendee } from "../model/attendee";

interface AttendanceRowNoteProps {
  attendee: Attendee;
  absent: boolean;
}

// 입력 화면에서만: 불참 기록이 취소되는 사람, 운영진 취소가 그대로 남는 사람에게 줄 아래 한 줄.
export function AttendanceRowNote({ attendee, absent }: AttendanceRowNoteProps) {
  const cancelsAbsence =
    !absent && (attendee.removed || attendee.absent) && !attendee.staffCancelled;
  const keepsStaffCancel = absent && attendee.staffCancelled;
  if (!cancelsAbsence && !keepsStaffCancel) return null;

  const note = cancelsAbsence
    ? `참석으로 확정하면 ${attendee.username}님의 불참 기록이 취소됩니다.`
    : "운영진이 취소한 불참은 그대로 취소로 남습니다";
  return (
    <Text typography="body4" foreground="hint" render={<p />} className="px-150 pb-125 break-keep">
      {note}
    </Text>
  );
}
