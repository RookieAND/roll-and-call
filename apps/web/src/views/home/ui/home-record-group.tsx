import { Text } from "@trpg/ui";

import type { RecordRow } from "../model/rank-people";
import { HomeRecordLeader } from "./home-record-leader";
import { HomeRecordRow } from "./home-record-row";

export function HomeRecordGroup({
  label,
  rows,
  className,
}: {
  label: string;
  rows: (RecordRow | null)[];
  className?: string;
}) {
  const [leader, ...runnersUp] = rows;

  return (
    <div className={className}>
      <Text
        typography="body4"
        foreground="hint"
        render={<div />}
        className="mb-[9px] text-[11.5px] font-extrabold tracking-[0.06em]"
      >
        {label}
      </Text>
      {leader ? <HomeRecordLeader row={leader} /> : <HomeRecordRow row={null} position={1} />}
      <div className="divide-y divide-gray-100 px-0.5">
        {runnersUp.map((row, index) => (
          <HomeRecordRow key={row?.person.id ?? `empty-${index}`} row={row} position={index + 2} />
        ))}
      </div>
    </div>
  );
}
