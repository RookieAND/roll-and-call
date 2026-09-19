import { HStack, Text, cn } from "@trpg/ui";

import { RECRUIT_METHOD, type RecruitMethod } from "../model/recruit-method";
import { GAME_STATUS, type GameStatus } from "../model/status";

// 칸이 많아지면 셀 수 없어서 숫자만 남긴다.
const MAX_METER_SEATS = 8;

export function GameCapacity({
  status,
  recruitMethod,
  confirmed,
  waiting,
  maxPlayers,
}: {
  status: GameStatus;
  recruitMethod: RecruitMethod;
  confirmed: number;
  waiting: number;
  maxPlayers: number;
}) {
  const open = status === GAME_STATUS.recruiting;
  // 추첨은 마감 전까지 확정된 자리가 없어 채울 칸도 없다.
  const drawPending = recruitMethod === RECRUIT_METHOD.lottery && open;
  const lottery = recruitMethod === RECRUIT_METHOD.lottery;

  return (
    <HStack align="center" gap={2} className="shrink-0">
      <Text
        typography="body4"
        foreground={lottery ? "primary" : "muted"}
        className={lottery ? "font-bold" : "font-semibold"}
      >
        {lottery ? "추첨" : "선착순"}
      </Text>
      {!drawPending && maxPlayers <= MAX_METER_SEATS && (
        <span aria-hidden className="flex shrink-0 gap-[3px]">
          {Array.from({ length: maxPlayers }, (_, seat) => (
            <span
              key={seat}
              className={cn(
                "h-1.5 w-2 rounded-[2px]",
                // 자리가 남은 글만 primary. 정원이 찼거나 마감된 글은 모두 무채색이다.
                seat < confirmed ? (open ? "bg-primary-600" : "bg-gray-400") : "bg-gray-200",
              )}
            />
          ))}
        </span>
      )}
      {drawPending ? (
        <>
          <Text typography="subtitle2" className="tabular-nums">
            신청 {confirmed + waiting}
          </Text>
          <Text typography="body4" foreground="muted" className="tabular-nums">
            정원 {maxPlayers}
          </Text>
        </>
      ) : (
        <>
          <Text typography="subtitle2" className="tabular-nums">
            {confirmed}/{maxPlayers}
          </Text>
          {waiting > 0 && (
            <Text typography="body4" foreground="muted" className="font-semibold tabular-nums">
              대기 {waiting}
            </Text>
          )}
        </>
      )}
    </HStack>
  );
}
