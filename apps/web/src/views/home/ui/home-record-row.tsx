import { cn, HStack, Text } from "@roll-and-call/ui";
import Link from "next/link";

import { ProfileRow } from "@/entities/profile";

import type { RecordRow } from "../model/rank-people";

interface HomeRecordRowProps {
  row: RecordRow | null;
  position: number;
}

export function HomeRecordRow({ row, position }: HomeRecordRowProps) {
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
      <ProfileRow size="sm" name={row.person.username} avatarUrl={row.person.avatarUrl} />
      <Text typography="body4" weight="extrabold" numeric className="flex-none">
        {row.count}
      </Text>
    </Link>
  );
}
