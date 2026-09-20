import { RECRUIT_METHOD, type RecruitMethod } from "./recruit-method";
import { GAME_STATUS, type GameStatus } from "./status";

export type CapacityPart = { text: string; emphasis: boolean };

export function capacityParts({
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
}): CapacityPart[] {
  const lottery = recruitMethod === RECRUIT_METHOD.lottery;
  // 마감된 글에서 몇 명이 찼는지는 이제 할 수 있는 일을 바꾸지 않아 방식과 정원만 남긴다.
  const done = status === GAME_STATUS.closed || status === GAME_STATUS.full;
  // 추첨은 마감 전까지 확정된 자리가 없어 신청자 수를 센다.
  const drawPending = lottery && !done;

  const parts: CapacityPart[] = [{ text: lottery ? "추첨" : "선착순", emphasis: false }];
  if (!done) {
    parts.push({
      text: drawPending ? `신청 ${confirmed + waiting}` : `확정 ${confirmed}`,
      emphasis: true,
    });
  }
  parts.push({ text: `정원 ${maxPlayers}`, emphasis: false });
  if (!done && !drawPending && waiting > 0) {
    parts.push({ text: `대기 ${waiting}`, emphasis: false });
  }
  return parts;
}
