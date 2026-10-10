import { RANKING_MODE, type RankingMode } from "@roll-and-call/database/servers/model";
import { cn, HStack, Text, VStack } from "@roll-and-call/ui";

import { ProfileRow } from "@/entities/profile";
import { ServerLink } from "@/shared/ui";

import type { RecordRow } from "../model/rank-people";

interface HomeRecordRowProps {
  row: RecordRow | null;
  position: number;
  mode: RankingMode;
}

export function HomeRecordRow({ row, position, mode }: HomeRecordRowProps) {
  const points = mode === RANKING_MODE.points;
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
    <ServerLink
      path={`/users/${row.person.id}`}
      className="flex items-center gap-125 px-150 py-125 transition-colors hover:bg-gray-50"
    >
      {rankNumber}
      <ProfileRow size="sm" name={row.person.username} avatarUrl={row.person.avatarUrl} />
      <VStack align="end" className="flex-none">
        <Text typography="body4" weight="extrabold" numeric>
          {points ? `${row.count}점` : row.count}
        </Text>
        {points && (
          <Text typography="body5" foreground="hint" numeric>
            세션 {row.sessions}회
          </Text>
        )}
      </VStack>
    </ServerLink>
  );
}
