import { Badge, HStack, Text, cn } from "@trpg/ui";

import { GameStatusBadge, type GameStatus, type ScheduleLine } from "@/entities/game";

// 마감은 배지가 맡고, 상태 줄은 일정만 말한다.
export function GameDetailHeader({
  title,
  status,
  statusLine,
}: {
  title: string;
  status: GameStatus;
  statusLine: ScheduleLine;
}) {
  return (
    <div>
      <HStack justify="between" align="start" gap={2}>
        <Text typography="heading1" render={<h1 />}>
          {title}
        </Text>
        <HStack align="center" gap={1} className="mt-0.5 shrink-0">
          {statusLine.deadlineShort && (
            <Badge className="tabular-nums">{statusLine.deadlineShort}</Badge>
          )}
          <GameStatusBadge status={status} />
        </HStack>
      </HStack>
      <Text
        typography="body3"
        foreground="hint"
        render={<p />}
        className={cn("mt-1 font-semibold", statusLine.confirmed && "text-success-700")}
      >
        {statusLine.text}
      </Text>
    </div>
  );
}
