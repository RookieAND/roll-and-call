import { Grid } from "@roll-and-call/ui";

import type { RosterSummary } from "../model/roster-summary";
import { STAT_TONE } from "../model/stat-tone";
import { RosterStat } from "./roster-stat";

interface RosterStatsProps {
  confirmedCount: number;
  waitingCount: number;
  maxPlayers: number;
  summary: RosterSummary;
}

export function RosterStats({
  confirmedCount,
  waitingCount,
  maxPlayers,
  summary,
}: RosterStatsProps) {
  if (summary.beforeDraw || summary.noApplicantsClosed) {
    const drawTone = summary.noApplicantsClosed ? STAT_TONE.neutral : STAT_TONE.primary;
    return (
      <Grid cols={2} gap="100">
        <RosterStat label="신청" value={`${summary.applicantCount}명`} />
        <RosterStat label="뽑을 인원" value={`${summary.drawCount}명`} tone={drawTone} />
      </Grid>
    );
  }

  const confirmedTone = confirmedCount > 0 ? STAT_TONE.success : STAT_TONE.neutral;
  return (
    <Grid cols={2} gap="100">
      <RosterStat label="확정" value={`${confirmedCount}/${maxPlayers}`} tone={confirmedTone} />
      <RosterStat label="대기" value={`${waitingCount}명`} />
    </Grid>
  );
}
