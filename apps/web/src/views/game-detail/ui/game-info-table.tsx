import { formatPlayMinutes } from "@roll-and-call/database/games/model";
import { Avatar, Badge, Card, HStack, Text } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { gameKindLabel, playTypeLabel } from "@/entities/game";
import { formatDateTime, formatGameSchedule } from "@/shared/lib";
import type { GameDetailData } from "@/shared/server";
import { ServerLink } from "@/shared/ui";

interface GameInfoTableProps {
  game: GameDetailData;
  isGm: boolean;
}

export function GameInfoTable({ game, isGm }: GameInfoTableProps) {
  const rows: { label: string; value: ReactNode }[] = [
    { label: "구분", value: gameKindLabel(game.kind) },
    { label: "룰", value: game.rule },
    { label: "플레이 유형", value: playTypeLabel(game.playType) },
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
    ...(game.playMinutes
      ? [{ label: "플레이타임", value: formatPlayMinutes(game.playMinutes) }]
      : []),
    { label: "모집 마감일", value: formatDateTime(game.endDate) },
    { label: "세션 일정", value: formatGameSchedule(game) },
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
