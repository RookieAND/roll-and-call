import type { RecordRanking, RecordRow } from "../model/rank-people";
import { HomeRecordLeader } from "./home-record-leader";
import { HomeRecordRow } from "./home-record-row";

interface HomeRecordRankingProps {
  label: string;
  leaders: [RecordRow, ...RecordRow[]];
  runnersUp: RecordRanking["runnersUp"];
}

export function HomeRecordRanking({ label, leaders, runnersUp }: HomeRecordRankingProps) {
  return (
    <>
      <HomeRecordLeader label={label} leaders={leaders} />
      <div className="divide-y divide-gray-100 px-025">
        {runnersUp.map((row, index) => (
          <HomeRecordRow key={row?.person.id ?? `empty-${index}`} row={row} position={index + 2} />
        ))}
      </div>
    </>
  );
}
