import type { GameDetailData } from "@roll-and-call/database/games";
import { formatPlayRange } from "@roll-and-call/database/games/model";
import { Avatar, Badge, Card, HStack, Text } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { GAME_VISIBILITY, PrivateMark } from "@/entities/game";
import { MemberTitle } from "@/features/view-badge";
import { formatDateTime, formatGameSchedule } from "@/shared/lib";
import { ServerLink } from "@/shared/ui";

import { GameSupplementList } from "./game-supplement-list";

interface GameInfoTableProps {
  game: GameDetailData;
  isGm: boolean;
  deadlineBadge: string | null;
  sessionBadge: string | null;
}

export function GameInfoTable({ game, isGm, deadlineBadge, sessionBadge }: GameInfoTableProps) {
  const playRange = formatPlayRange(game.playMinutesMin, game.playMinutes);
  const isPrivate = game.visibility === GAME_VISIBILITY.private;
  // 비공개 구인은 모집 마감이 없다. 같은 자리에 공개 범위를 둔다.
  const deadlineOrVisibility = isPrivate
    ? { label: "모집 유형", value: <PrivateMark /> }
    : {
        label: "모집 마감일",
        value: (
          <HStack align="center" gap="100" wrap className="min-w-0">
            <span>{formatDateTime(game.endDate)}</span>
            {deadlineBadge && <Badge className="tabular-nums">{deadlineBadge}</Badge>}
          </HStack>
        ),
      };
  const rows: { label: string; value: ReactNode; top?: boolean }[] = [
    { label: "룰", value: game.rule },
    ...(game.supplements.length > 0
      ? [
          {
            label: "서플리먼트",
            value: <GameSupplementList supplements={game.supplements} />,
            top: true,
          },
        ]
      : []),
    {
      label: "GM",
      value: (
        <ServerLink
          path={`/users/${game.gmId}`}
          className="relative inline-flex min-w-0 items-center gap-100 after:absolute after:inset-x-0 after:-inset-y-075"
        >
          <Avatar src={game.gm?.avatarUrl} name={game.gm?.username} size="sm" />
          <span className="truncate">{game.gm?.username ?? "?"}</span>
          <span className="hidden min-w-0 desktop:inline-flex">
            <MemberTitle userId={game.gmId} size="sm" />
          </span>
          {isGm && <Badge colorPalette="primary">나</Badge>}
        </ServerLink>
      ),
    },
    ...(playRange ? [{ label: "플레이타임", value: playRange }] : []),
    deadlineOrVisibility,
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
        <HStack
          key={row.label}
          align={row.top ? "start" : "center"}
          gap="150"
          className="min-h-10 px-175 py-100"
        >
          <Text typography="body4" foreground="hint" className="w-18.5 shrink-0">
            {row.label}
          </Text>
          <Text
            typography="body3"
            weight="medium"
            numeric
            render={<div />}
            className="flex min-w-0 flex-1 items-center desktop:text-body2"
          >
            {row.value}
          </Text>
        </HStack>
      ))}
    </Card.Root>
  );
}
