import { Avatar, cn, HStack, Text } from "@trpg/ui";
import Link from "next/link";

import type { RecordRow } from "../model/rank-people";

export function HomeRecordRow({ row, position }: { row: RecordRow | null; position: number }) {
  const rank = row?.rank ?? position;
  const rankTone = rank === 3 ? "text-rank-bronze" : "text-hint";
  const rankNumber = (
    <Text
      typography="body4"
      weight="extrabold"
      numeric
      className={cn("w-[13px] flex-none", rankTone)}
    >
      {rank}
    </Text>
  );

  if (!row) {
    return (
      <HStack align="center" gap="125" className="px-150 py-125">
        {rankNumber}
        <Text typography="body4" foreground="hint">
          아직 비어 있습니다
        </Text>
      </HStack>
    );
  }

  return (
    <Link
      href={`/u/${row.person.id}`}
      className="flex items-center gap-125 px-150 py-125 transition-colors hover:bg-gray-50"
    >
      {rankNumber}
      <Avatar src={row.person.avatarUrl} name={row.person.username} size="sm" />
      <Text weight="bold" typography="body4" truncate className="min-w-0 flex-1">
        {row.person.username}
      </Text>
      <Text typography="body4" weight="extrabold" numeric className="flex-none">
        {row.count}
      </Text>
    </Link>
  );
}
