import { Badge, Card, HStack, Text, VStack } from "@roll-and-call/ui";
import { User } from "lucide-react";

import { toKst } from "@/shared/lib";

import type { CalendarSession } from "../model/to-calendar-sessions";

interface HomeSessionCardProps {
  session: CalendarSession;
}

// 내가 참여한 세션은 tinted 카드 + "내가 참여" 배지로 다른 세션과 갈린다.
export function HomeSessionCard({ session }: HomeSessionCardProps) {
  const time = toKst(session.startsAt).format("HH:mm");

  return (
    <Card.Root
      interactive
      padding="sm"
      radius={600}
      background="none"
      className={session.mine ? "border-tinted-border bg-tinted-bg" : undefined}
    >
      <HStack gap="150" align="start" className="px-025">
        <Text typography="subtitle2" weight="extrabold" numeric className="w-11 flex-none pt-025">
          {time}
        </Text>
        <VStack gap="100" className="min-w-0 flex-1">
          <HStack align="center" gap="100">
            <Text truncate typography="subtitle1" className="min-w-0 flex-1">
              {session.title}
            </Text>
            {session.mine && <Badge colorPalette="primary">내가 참여</Badge>}
          </HStack>
          <HStack align="center" gap="100">
            <Badge colorPalette="gray">{session.rule}</Badge>
            <Text typography="body4" foreground="muted" truncate className="min-w-0 flex-1">
              GM {session.gm.username}
            </Text>
            <Text
              typography="body4"
              weight="bold"
              foreground="hint"
              numeric
              aria-label={`참여 인원 ${session.players.length}/${session.maxPlayers}`}
              className="flex flex-none items-center gap-050"
            >
              <User size={12} aria-hidden />
              {session.players.length}/{session.maxPlayers}
            </Text>
          </HStack>
        </VStack>
      </HStack>
    </Card.Root>
  );
}
