import { HStack, Text } from "@trpg/ui";

import { RECRUIT_METHOD, type RecruitMethod } from "../model/recruit-method";
import { GAME_STATUS, type GameStatus } from "../model/status";

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
  const lottery = recruitMethod === RECRUIT_METHOD.lottery;
  // 마감된 글에서 몇 명이 찼는지는 이제 할 수 있는 일을 바꾸지 않아 방식과 정원만 남긴다.
  const done = status === GAME_STATUS.closed || status === GAME_STATUS.full;
  // 추첨은 마감 전까지 확정된 자리가 없어 신청자 수를 센다.
  const drawPending = lottery && !done;

  return (
    <HStack
      align="center"
      className="h-[26px] shrink-0 gap-[7px] rounded-lg border border-gray-200 bg-gray-50 px-[9px]"
    >
      <Text typography="body4" foreground="muted" className="font-semibold">
        {lottery ? "추첨" : "선착순"}
      </Text>
      {!done && (
        <Text typography="subtitle2" className="tabular-nums">
          {drawPending ? `신청 ${confirmed + waiting}` : `확정 ${confirmed}`}
        </Text>
      )}
      <Text typography="body4" foreground="muted" className="font-semibold tabular-nums">
        정원 {maxPlayers}
      </Text>
      {!done && !drawPending && waiting > 0 && (
        <Text typography="body4" foreground="muted" className="font-semibold tabular-nums">
          대기 {waiting}
        </Text>
      )}
    </HStack>
  );
}
