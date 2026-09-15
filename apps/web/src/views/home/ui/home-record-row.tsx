import { Avatar, cn, Text } from "@trpg/ui";
import Link from "next/link";

import type { RecordRow } from "../model/rank-people";

export function HomeRecordRow({ row, position }: { row: RecordRow | null; position: number }) {
  if (!row) {
    return (
      <div className="flex h-[42px] items-center gap-2 px-[11px]">
        <span className="w-[15px] flex-none text-[13px] font-bold text-hint tabular-nums">
          {position}
        </span>
        <Text typography="body4" foreground="hint" className="text-[12.5px]">
          아직 비어 있습니다
        </Text>
      </div>
    );
  }

  const rankTone = row.rank === 1 ? "font-extrabold text-primary-ink" : "font-bold text-hint";

  return (
    <Link
      href={`/u/${row.person.id}`}
      className="flex h-[42px] items-center gap-2 px-[11px] transition-colors hover:bg-gray-50"
    >
      <span className={cn("w-[15px] flex-none text-[13px] tabular-nums", rankTone)}>
        {row.rank}
      </span>
      <Avatar src={row.person.avatarUrl} name={row.person.username} size="sm" />
      <span className="min-w-0 flex-1 truncate text-[12.5px] font-bold">{row.person.username}</span>
      <span className="flex-none text-[13px] font-extrabold tabular-nums">{row.count}</span>
    </Link>
  );
}
