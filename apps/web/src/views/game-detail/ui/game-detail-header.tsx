import { HStack, Text, cn } from "@trpg/ui";
import { GameStatusBadge, type GameStatus, type ScheduleLine } from "@/entities/game";
import { GameGmMenu } from "./game-gm-menu";

// 제목 + 모집 상태 배지 + 상태 한 줄(일정 · 마감 D-n). GM에게만 ⋯ 메뉴가 붙는다.
export function GameDetailHeader({
  gameId,
  title,
  status,
  statusLine,
  isGm,
  confirmedCount,
  waitingCount,
  canChangeTime,
}: {
  gameId: string;
  title: string;
  status: GameStatus;
  statusLine: ScheduleLine;
  isGm: boolean;
  confirmedCount: number;
  waitingCount: number;
  canChangeTime: boolean;
}) {
  const scheduleClass = cn("font-semibold", statusLine.confirmed && "text-success-700");
  const deadlineClass = cn(statusLine.deadlineWarn && "font-semibold text-warning-600");

  return (
    <div>
      <HStack justify="between" align="start" gap={2}>
        <Text typography="heading1" render={<h1 />}>
          {title}
        </Text>
        <HStack align="center" gap={1} className="mt-0.5 shrink-0">
          <GameStatusBadge status={status} />
          {isGm && (
            <GameGmMenu
              gameId={gameId}
              confirmedCount={confirmedCount}
              waitingCount={waitingCount}
              canChangeTime={canChangeTime}
            />
          )}
        </HStack>
      </HStack>
      <Text typography="body3" foreground="hint" render={<p />} className="mt-1">
        <span className={scheduleClass}>{statusLine.text}</span>
        {statusLine.deadline && (
          <>
            <span aria-hidden> · </span>
            <span className={deadlineClass}>{statusLine.deadline}</span>
          </>
        )}
      </Text>
    </div>
  );
}
