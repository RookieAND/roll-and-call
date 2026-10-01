import { Grid } from "@roll-and-call/ui";

import { ATTENDANCE_STAGE, type AttendanceStage } from "../model/attendance-stage";
import type { ManagedMember } from "../model/managed-member";
import type { RosterSummary } from "../model/roster-summary";
import { STAT_TONE } from "../model/stat-tone";
import { RosterStat } from "./roster-stat";

interface RosterStatsProps {
  confirmed: ManagedMember[];
  waitingCount: number;
  summary: RosterSummary;
  attendanceStage: AttendanceStage | null;
}

export function RosterStats({
  confirmed,
  waitingCount,
  summary,
  attendanceStage,
}: RosterStatsProps) {
  if (attendanceStage) {
    const checked = attendanceStage === ATTENDANCE_STAGE.done;
    const absentCount = confirmed.filter((member) => member.absent).length;
    return (
      <Grid cols={2} gap="100">
        <RosterStat label="완료" count={checked ? confirmed.length - absentCount : null} />
        <RosterStat
          label="불참"
          count={checked ? absentCount : null}
          tone={checked && absentCount > 0 ? STAT_TONE.danger : STAT_TONE.neutral}
        />
      </Grid>
    );
  }

  return (
    <Grid cols={2} gap="100">
      {summary.beforeDraw ? (
        <>
          <RosterStat label="신청" count={summary.applicantCount} />
          <RosterStat label="뽑을 인원" count={summary.drawCount} tone={STAT_TONE.primary} />
        </>
      ) : (
        <>
          <RosterStat
            label="확정"
            count={confirmed.length}
            tone={confirmed.length > 0 ? STAT_TONE.success : STAT_TONE.neutral}
          />
          <RosterStat label="대기" count={waitingCount} />
        </>
      )}
    </Grid>
  );
}
