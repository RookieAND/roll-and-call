export const COORDINATION_PHASE = {
  idle: "idle",
  open: "open",
  ended: "ended",
} as const;

export type CoordinationPhase = (typeof COORDINATION_PHASE)[keyof typeof COORDINATION_PHASE];

// end·today는 KST 날짜 문자열. 마감일 당일까지 받는다.
export function coordinationPhase({
  status,
  end,
  today,
}: {
  status: string | null;
  end: string | null;
  today: string;
}): CoordinationPhase {
  if (status !== "coordinating" || end === null) return COORDINATION_PHASE.idle;
  return today <= end ? COORDINATION_PHASE.open : COORDINATION_PHASE.ended;
}
