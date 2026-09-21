import { Badge } from "@trpg/ui";

import { ATTENDANCE_STAGE, type AttendanceStage } from "../model/attendance-stage";

interface AttendanceBadgeProps {
  stage: AttendanceStage;
  absent: boolean;
}

export function AttendanceBadge({ stage, absent }: AttendanceBadgeProps) {
  if (stage === ATTENDANCE_STAGE.due) {
    return (
      <Badge color="gray" className="shrink-0 text-hint">
        미확인
      </Badge>
    );
  }
  return (
    <Badge color={absent ? "danger" : "success"} className="shrink-0">
      {absent ? "불참" : "완료"}
    </Badge>
  );
}
