import { Badge, Card, cn, HStack, Text, VStack } from "@roll-and-call/ui";
import { User } from "lucide-react";

import { toKst } from "@/shared/lib";

import type { CalendarSession } from "../model/to-calendar-sessions";

interface HomeSessionCardProps {
  session: CalendarSession;
  // 데스크톱 우측 패널은 폭이 좁아 제목을 줄바꿈하고, 룰·내가 참여 뱃지를 제목 아래 줄에 둔다.
  stacked?: boolean;
}

export function HomeSessionCard({ session, stacked = false }: HomeSessionCardProps) {
  const time = toKst(session.startsAt).format("HH:mm");
  const seats = (
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
  );

  return (
    <Card.Root
      interactive
      padding="sm"
      radius={600}
      background="none"
      className={cn(session.mine && "border-tinted-border bg-tinted-bg")}
    >
      <HStack gap="150" align="start" className="px-025">
        <Text typography="subtitle2" weight="extrabold" numeric className="w-11 flex-none pt-025">
          {time}
        </Text>
        {stacked ? (
          <VStack gap="100" className="min-w-0 flex-1">
            <Text typography="subtitle1" className="text-pretty">
              {session.title}
            </Text>
            <HStack align="center" gap="075" wrap>
              <Badge colorPalette="gray">{session.rule}</Badge>
              {session.mine && <Badge colorPalette="primary">내가 참여</Badge>}
            </HStack>
            <HStack align="center" gap="100">
              <Text typography="body4" foreground="muted" truncate className="min-w-0 flex-1">
                GM {session.gm.username}
              </Text>
              {seats}
            </HStack>
          </VStack>
        ) : (
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
              {seats}
            </HStack>
          </VStack>
        )}
      </HStack>
    </Card.Root>
  );
}
