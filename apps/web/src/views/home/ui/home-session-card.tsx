import { cn, HStack, Text } from "@trpg/ui";
import { User } from "lucide-react";

import { GameRuleChip } from "@/entities/game";
import { toKst } from "@/shared/lib";

import type { CalendarSession } from "../model/to-calendar-sessions";

interface HomeSessionCardProps {
  session: CalendarSession;
}

export function HomeSessionCard({ session }: HomeSessionCardProps) {
  const time = toKst(session.startsAt).format("HH:mm");
  const full = session.players.length >= session.maxPlayers;
  const cardTone = session.mine
    ? "border-tinted-border bg-tinted-bg hover:bg-tinted-bg-hover"
    : "border-gray-200 hover:bg-gray-50";

  return (
    <div
      className={cn("flex gap-150 rounded-600 border px-175 py-150 transition-colors", cardTone)}
    >
      <Text typography="subtitle2" weight="extrabold" numeric className="w-11 flex-none pt-px">
        {time}
      </Text>
      <div className="min-w-0 flex-1">
        <HStack align="center" gap="100">
          <Text truncate typography="subtitle1" className="min-w-0 flex-1">
            {session.title}
          </Text>
          {session.mine && (
            <Text
              weight="bold"
              typography="body4"
              foreground="primary"
              tight
              className="flex-none rounded-200 bg-primary-50 px-100 py-050 dark:bg-primary-200"
            >
              내가 참여
            </Text>
          )}
        </HStack>
        <HStack align="center" gap="100" className="mt-100">
          <GameRuleChip rule={session.rule} className="dark:bg-gray-200 dark:text-gray-800" />
          <Text
            typography="body4"
            foreground="muted"
            render={<span />}
            className="min-w-0 flex-1 truncate"
          >
            GM {session.gm.username}
          </Text>
          <span
            aria-label={`참여 인원 ${session.players.length}/${session.maxPlayers}`}
            className={cn(
              "flex flex-none items-center gap-050",
              full ? "text-hint" : "text-tinted-ink",
            )}
          >
            <User size={12} aria-hidden />
            <Text weight="bold" typography="body4" numeric foreground="inherit">
              {session.players.length}/{session.maxPlayers}
            </Text>
          </span>
        </HStack>
      </div>
    </div>
  );
}
