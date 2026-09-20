import { Avatar, cn, Text } from "@trpg/ui";
import Link from "next/link";

import type { RecordRow } from "../model/rank-people";

export function HomeRecordRow({ row, position }: { row: RecordRow | null; position: number }) {
  const rank = row?.rank ?? position;
  const rankTone = rank === 3 ? "text-rank-bronze" : "text-hint";
  const rankNumber = (
    <Text
      typography="subtitle3"
      weight="extrabold"
      numeric
      className={cn("w-[13px] flex-none", rankTone)}
    >
      {rank}
    </Text>
  );

  if (!row) {
    return (
      <div className="flex items-center gap-2.5 px-3 py-[9px]">
        {rankNumber}
        <Text typography="body4" foreground="hint">
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
      <Text typography="subtitle3" truncate className="min-w-0 flex-1">
        {row.person.username}
      </Text>
      <Text typography="subtitle3" weight="extrabold" numeric className="flex-none">
        {row.count}
      </Text>
    </Link>
  );
}
