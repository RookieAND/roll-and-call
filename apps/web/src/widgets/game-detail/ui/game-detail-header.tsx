import { Badge, HStack, Text, VStack } from "@roll-and-call/ui";

import {
  GAME_KIND,
  GameScheduleRow,
  GameStatusBadge,
  type GameKind,
  type GameStatus,
  type ScheduleLine,
} from "@/entities/game";

interface GameDetailHeaderProps {
  title: string;
  kind: GameKind;
  status: GameStatus;
  ended: boolean;
  showDeadline: boolean;
  statusLine: ScheduleLine;
}

// 끝난 세션은 목록 카드처럼 「종료」로 덮는다. deriveGameStatus는 다른 화면도 써서 여기서만 바꾼다.
export function GameDetailHeader({
  title,
  kind,
  status,
  ended,
  showDeadline,
  statusLine,
}: GameDetailHeaderProps) {
  const deadline = showDeadline ? statusLine.deadlineShort : null;

  return (
    <VStack gap="100">
      <HStack justify="between" align="start" gap="100">
        <Text typography="heading1" render={<h1 />} className="min-w-0 flex-1">
          {title}
        </Text>
        {kind === GAME_KIND.briefing && (
          <Badge colorPalette="primary" className="mt-025">
            설명회
          </Badge>
        )}
        {deadline && <Badge className="mt-025 tabular-nums">{deadline}</Badge>}
        <span className="mt-025">
          {ended ? <Badge colorPalette="gray">종료</Badge> : <GameStatusBadge status={status} />}
        </span>
      </HStack>
      <GameScheduleRow line={statusLine} scale="header" />
    </VStack>
  );
}
