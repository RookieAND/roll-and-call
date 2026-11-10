import { Card, HStack, Text, VStack } from "@roll-and-call/ui";
import { CalendarDays, ChevronRight } from "lucide-react";

import { SESSION_ROLE, type SessionRole } from "@/entities/game";
import { formatDateTime, toKst } from "@/shared/lib";
import { ServerLink } from "@/shared/ui";
import type { SessionCardModel } from "@/widgets/session-list";

import { monthSessions } from "../model/month-sessions";

interface MySessionsPanelProps {
  role: SessionRole;
  cards: SessionCardModel[];
  now?: Date;
}

export function MySessionsPanel({ role, cards, now = new Date() }: MySessionsPanelProps) {
  const upcoming = monthSessions({ cards, now });
  const verb = role === SESSION_ROLE.host ? "운영" : "참여";
  return (
    <Card.Root padding="md" radius={600}>
      <VStack gap="150">
        <HStack gap="075" align="center">
          <CalendarDays size={18} aria-hidden className="text-hint" />
          <Text typography="subtitle1" render={<h2 />}>
            {toKst(now).format("M월")} 예정된 세션
          </Text>
        </HStack>
        {upcoming.length ? (
          <ul className="max-h-[calc(100dvh-10rem)] divide-y divide-gray-200 overflow-y-auto">
            {upcoming.map((card) => (
              <li key={card.id}>
                <ServerLink
                  path={`/games/${card.id}`}
                  className="group flex min-h-16 items-center gap-100 rounded-300 px-050 py-125 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-tinted-ink"
                >
                  <VStack gap="050" className="min-w-0 flex-1">
                    <Text
                      typography="body4"
                      foreground="primary"
                      weight="bold"
                      render={<time dateTime={card.startsAt!} />}
                    >
                      {formatDateTime(card.startsAt!)}
                    </Text>
                    <Text typography="subtitle2" className="line-clamp-2 break-keep">
                      {card.title}
                    </Text>
                  </VStack>
                  <ChevronRight size={16} aria-hidden className="shrink-0 text-hint" />
                </ServerLink>
              </li>
            ))}
          </ul>
        ) : (
          <Text typography="body3" foreground="muted" className="py-150 break-keep" render={<p />}>
            이번 달 {verb} 예정인 세션이 없습니다.
          </Text>
        )}
      </VStack>
    </Card.Root>
  );
}
