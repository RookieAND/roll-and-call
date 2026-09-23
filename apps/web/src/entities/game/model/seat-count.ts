import { GAME_STATUS, type GameStatus } from "@/shared/lib";

import { RECRUIT_METHOD, type RecruitMethod } from "./recruit-method";
import { recruitMethodLabel } from "./recruit-method-label";
import { SEAT_TONE, type SeatTone } from "./seat-tone";

export type SeatCell = { text: string; tone: SeatTone };

// 정원 칸은 최대 3칸: 방식 | 핵심 수 | 보조 수. 지금 할 수 있는 일을 바꾸는 수만 진하게 쓴다.
export function seatCount({
  status,
  recruitMethod,
  confirmed,
  waiting,
  maxPlayers,
  ended,
}: {
  status: GameStatus;
  recruitMethod: RecruitMethod;
  confirmed: number;
  waiting: number;
  maxPlayers: number;
  ended: boolean;
}): SeatCell[] {
  const method: SeatCell = { text: recruitMethodLabel(recruitMethod), tone: SEAT_TONE.method };
  if (ended) return [method, { text: `참여 ${confirmed}`, tone: SEAT_TONE.plain }];

  const open = status === GAME_STATUS.recruiting || status === GAME_STATUS.confirmed;
  if (recruitMethod === RECRUIT_METHOD.lottery) {
    const capacity: SeatCell = { text: `정원 ${maxPlayers}`, tone: SEAT_TONE.plain };
    if (!open) return [method, capacity];
    return [method, { text: `신청 ${confirmed + waiting}`, tone: SEAT_TONE.strong }, capacity];
  }

  const cells: SeatCell[] = [
    method,
    { text: `확정 ${confirmed}/${maxPlayers}`, tone: open ? SEAT_TONE.strong : SEAT_TONE.plain },
  ];
  if (open && waiting > 0) cells.push({ text: `대기 ${waiting}`, tone: SEAT_TONE.plain });
  return cells;
}
