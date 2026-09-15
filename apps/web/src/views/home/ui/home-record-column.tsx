import { Text } from "@trpg/ui";

import type { RecordRow } from "../model/rank-people";
import { HomeRecordRow } from "./home-record-row";

export function HomeRecordColumn({
  title,
  caption,
  rows,
}: {
  title: string;
  caption: string;
  rows: (RecordRow | null)[];
}) {
  return (
    <div className="overflow-hidden rounded-[14px] border border-gray-200">
      <div className="border-b border-gray-200 bg-gray-50 px-3 pt-2.5 pb-[9px]">
        <Text typography="subtitle1" render={<div />} className="text-[13px] font-extrabold">
          {title}
        </Text>
        <Text typography="body4" foreground="hint" render={<div />} className="mt-0.5 text-[11px]">
          {caption}
        </Text>
      </div>
      <ol className="divide-y divide-gray-100">
        {rows.map((row, index) => (
          <li key={row?.person.id ?? `empty-${index}`}>
            <HomeRecordRow row={row} position={index + 1} />
          </li>
        ))}
      </ol>
    </div>
  );
}
