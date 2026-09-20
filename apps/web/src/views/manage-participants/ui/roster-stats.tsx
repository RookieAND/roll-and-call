import { Grid } from "@trpg/ui";

import type { RosterSummary } from "../model/roster-summary";
import { RosterStat } from "./roster-stat";

// 뽑기 전 추첨은 확정·대기가 없으므로 신청 수와 뽑을 인원을 대신 센다. 정원은 제목 옆 배지가 맡는다.
export function RosterStats({
  confirmedCount,
  waitingCount,
  maxPlayers,
  summary,
}: {
  confirmedCount: number;
  waitingCount: number;
  maxPlayers: number;
  summary: RosterSummary;
}) {
  return (
    <Grid cols={2} gap="100">
      {summary.beforeDraw ? (
        <>
          <RosterStat label="신청" count={summary.applicantCount} />
          <RosterStat label="뽑을 인원" count={maxPlayers} />
        </>
      ) : (
        <>
          <RosterStat label="확정" count={confirmedCount} />
          <RosterStat label="대기" count={waitingCount} />
        </>
      )}
    </Grid>
  );
}
