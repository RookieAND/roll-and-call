import type { RankingMode } from "@roll-and-call/database/servers/model";

import type { RecordRanking } from "../model/rank-people";
import { HomeRecordLeader } from "./home-record-leader";
import { HomeRecordRow } from "./home-record-row";
import { recordUnit } from "./home-record-unit";

interface HomeRecordRankingProps {
  label: string;
  ranking: RecordRanking;
  first: RecordRanking["leaders"][number];
  mode: RankingMode;
}

export function HomeRecordRanking({ label, ranking, first, mode }: HomeRecordRankingProps) {
  const { leaders, leaderCount, runnersUp } = ranking;

  return (
    <>
      <HomeRecordLeader
        label={label}
        people={[first, ...leaders.slice(1)]}
        count={leaderCount}
        unit={recordUnit(mode)}
      />
      <div className="divide-y divide-gray-100 px-025">
        {runnersUp.map((row, index) => (
          <HomeRecordRow
            key={row?.person.id ?? `empty-${index}`}
            row={row}
            position={index + 2}
            mode={mode}
          />
        ))}
      </div>
    </>
  );
}
