import type { RecordRanking } from "../model/rank-people";
import { HomeRecordLeader } from "./home-record-leader";
import { HomeRecordRow } from "./home-record-row";

interface HomeRecordRankingProps {
  label: string;
  ranking: RecordRanking;
  first: RecordRanking["leaders"][number];
}

export function HomeRecordRanking({ label, ranking, first }: HomeRecordRankingProps) {
  const { leaders, leaderSessionCount, runnersUp } = ranking;

  return (
    <>
      <HomeRecordLeader
        label={label}
        people={[first, ...leaders.slice(1)]}
        count={leaderSessionCount}
      />
      <div className="divide-y divide-gray-100 px-025">
        {runnersUp.map((row, index) => (
          <HomeRecordRow key={row?.person.id ?? `empty-${index}`} row={row} position={index + 2} />
        ))}
      </div>
    </>
  );
}
