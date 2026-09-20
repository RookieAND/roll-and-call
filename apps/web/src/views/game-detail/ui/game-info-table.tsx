import { Card, HStack, Text } from "@trpg/ui";
import Link from "next/link";
import type { ReactNode } from "react";

import { GameGmLabel } from "@/entities/game";
import { formatDateTime, formatGameSchedule } from "@/shared/lib";
import type { GameDetailData } from "@/shared/server";

// 인원은 참여자 섹션 한 곳(진행바 포함)에서만 보여준다.
export function GameInfoTable({ game, isGm }: { game: GameDetailData; isGm: boolean }) {
  const rows: { label: string; value: ReactNode }[] = [
    { label: "룰", value: game.rule },
    {
      label: "GM",
      value: (
        <Link href={`/u/${game.gmId}`} className="inline-flex items-center gap-075">
          <GameGmLabel
            name={game.gm?.username}
            avatarUrl={game.gm?.avatarUrl}
            showRole={false}
            typography="body4"
            foreground="normal"
            weight="bold"
          />
          {isGm && (
            <Text typography="body4" foreground="hint" render={<span />}>
              나
            </Text>
          )}
        </Link>
      ),
    },
    ...(game.playTime ? [{ label: "플레이타임", value: game.playTime }] : []),
    { label: "모집 마감일", value: formatDateTime(game.endDate) },
    { label: "세션 일정", value: formatGameSchedule(game) },
  ];

  return (
    <Card radius={600} background="none" padding="none" className="overflow-hidden">
      {rows.map((row) => (
        <HStack
          key={row.label}
          align="center"
          gap="150"
          className="min-h-12 border-b border-gray-100 px-200 last:border-b-0"
        >
          <Text typography="body3" foreground="muted" className="w-[82px] shrink-0">
            {row.label}
          </Text>
          <Text typography="body4" weight="bold" render={<div />} className="flex-1 items-center">
            {row.value}
          </Text>
        </HStack>
      ))}
    </Card>
  );
}
