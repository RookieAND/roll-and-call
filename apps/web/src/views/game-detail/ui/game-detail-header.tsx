import { Badge, HStack, Text, VStack } from "@roll-and-call/ui";

import {
  GameScheduleRow,
  GameStatusBadge,
  type GameStatus,
  type ScheduleLine,
} from "@/entities/game";

interface GameDetailHeaderProps {
  title: string;
  status: GameStatus;
  statusLine: ScheduleLine;
}

export function GameDetailHeader({ title, status, statusLine }: GameDetailHeaderProps) {
  return (
    <VStack gap="100">
      <HStack justify="between" align="start" gap="100">
        <Text typography="heading1" render={<h1 />} className="min-w-0 flex-1">
          {title}
        </Text>
        {statusLine.deadlineShort && (
          <Badge className="mt-025 tabular-nums">{statusLine.deadlineShort}</Badge>
        )}
        <span className="mt-025">
          <GameStatusBadge status={status} />
        </span>
      </HStack>
      <GameScheduleRow line={statusLine} scale="header" />
    </VStack>
  );
}
