import { Text } from "@roll-and-call/ui";

import type { Attendee } from "../model/attendee";

interface AttendanceRowNoteProps {
  attendee: Attendee;
  absent: boolean;
}

// 입력 화면에서만: 운영진이 취소한 불참을 다시 골랐을 때 줄 아래 한 줄.
export function AttendanceRowNote({ attendee, absent }: AttendanceRowNoteProps) {
  if (!absent || !attendee.staffCancelled) return null;

  return (
    <Text typography="body4" foreground="hint" render={<p />} className="px-150 pb-125 break-keep">
      운영진이 취소한 불참은 그대로 취소로 남습니다
    </Text>
  );
}
