import { Grid } from "@trpg/ui";

import { AttendanceStat } from "./attendance-stat";

interface AttendanceStatsProps {
  presentCount: number;
  absentCount: number;
}

// 불참이 0이면 아무 일도 없었다는 뜻이라 색을 붙이지 않는다.
export function AttendanceStats({ presentCount, absentCount }: AttendanceStatsProps) {
  return (
    <Grid cols={2} gap="100">
      <AttendanceStat label="참석" count={presentCount} />
      <AttendanceStat label="불참" count={absentCount} danger={absentCount > 0} />
    </Grid>
  );
}
