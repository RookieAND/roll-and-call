import { Avatar, cn, Text } from "@trpg/ui";
import Link from "next/link";

import type { RecordRow } from "../model/rank-people";

export function HomeRecordRow({ row, position }: { row: RecordRow | null; position: number }) {
  const rank = row?.rank ?? position;
  const rankTone = rank === 3 ? "text-rank-bronze" : "text-hint";
  const rankNumber = (
    <span className={cn("w-[13px] flex-none text-[12px] font-extrabold tabular-nums", rankTone)}>
      {rank}
    </span>
  );

  if (!row) {
    return (
      <div className="flex items-center gap-2.5 px-3 py-[9px]">
        {rankNumber}
        <Text typography="body4" foreground="hint" className="text-[12.5px]">
          아직 비어 있습니다
        </Text>
      </div>
    );
  }

  return (
    <Link
      href={`/u/${row.person.id}`}
      className="flex items-center gap-2.5 px-3 py-[9px] transition-colors hover:bg-gray-50"
    >
      {rankNumber}
      <Avatar src={row.person.avatarUrl} name={row.person.username} size="sm" />
      <span className="min-w-0 flex-1 truncate text-[12.5px] font-bold">{row.person.username}</span>
      <span className="flex-none text-[12.5px] font-extrabold tabular-nums">{row.count}</span>
    </Link>
  );
}
