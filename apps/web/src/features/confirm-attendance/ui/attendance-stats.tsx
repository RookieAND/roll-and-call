import { Grid } from "@roll-and-call/ui";

import { AttendanceStat } from "./attendance-stat";

interface AttendanceStatsProps {
  presentCount: number;
  absentCount: number;
}

export function AttendanceStats({ presentCount, absentCount }: AttendanceStatsProps) {
  return (
    <Grid cols={2} gap="100">
      <AttendanceStat label="참석" count={presentCount} />
      <AttendanceStat label="불참" count={absentCount} danger={absentCount > 0} />
    </Grid>
  );
}
