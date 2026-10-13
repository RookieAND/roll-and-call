import { formatPlayRange } from "@roll-and-call/database/games/model";
import { Avatar, Badge, Card, HStack, Text } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { formatDateTime, formatGameSchedule } from "@/shared/lib";
import type { GameDetailData } from "@/shared/server";
import { ServerLink } from "@/shared/ui";

interface GameInfoTableProps {
  game: GameDetailData;
  isGm: boolean;
  deadlineBadge: string | null;
  deadlineWarn: boolean;
  sessionBadge: string | null;
}

export function GameInfoTable({
  game,
  isGm,
  deadlineBadge,
  deadlineWarn,
  sessionBadge,
}: GameInfoTableProps) {
  const deadlinePalette = deadlineWarn ? "warning" : "gray";
  const playRange = formatPlayRange(game.playMinutesMin, game.playMinutes);
  const rows: { label: string; value: ReactNode }[] = [
    { label: "룰", value: game.rule },
    {
      label: "GM",
      value: (
        <ServerLink
          path={`/users/${game.gmId}`}
          className="inline-flex min-w-0 items-center gap-100"
        >
          <Avatar src={game.gm?.avatarUrl} name={game.gm?.username} size="sm" />
          <span className="truncate">{game.gm?.username ?? "?"}</span>
          {isGm && <Badge colorPalette="primary">나</Badge>}
        </ServerLink>
      ),
    },
    ...(playRange ? [{ label: "플레이타임", value: playRange }] : []),
    {
      label: "모집 마감일",
      value: (
        <HStack align="center" gap="100" wrap className="min-w-0">
          <span>{formatDateTime(game.endDate)}</span>
          {deadlineBadge && (
            <Badge colorPalette={deadlinePalette} className="tabular-nums">
              {deadlineBadge}
            </Badge>
          )}
        </HStack>
      ),
    },
    {
      label: "세션 일정",
      value: (
        <HStack align="center" gap="100" wrap className="min-w-0">
          <span>{formatGameSchedule(game)}</span>
          {sessionBadge && <Badge className="tabular-nums">{sessionBadge}</Badge>}
        </HStack>
      ),
    },
  ];

  return (
    <Card.Root
      radius={500}
      background="subtle"
      padding="none"
      className="overflow-hidden [&>*+*]:border-t [&>*+*]:border-gray-200"
    >
      {rows.map((row) => (
        <HStack key={row.label} align="center" gap="150" className="min-h-10 px-175 py-100">
          <Text typography="body4" foreground="hint" className="w-18.5 shrink-0">
            {row.label}
          </Text>
          <Text
            typography="body3"
            weight="medium"
            numeric
            render={<div />}
            className="flex min-w-0 flex-1 items-center"
          >
            {row.value}
          </Text>
        </HStack>
      ))}
    </Card.Root>
  );
}
