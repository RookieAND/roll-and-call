import type { Game } from "@roll-and-call/database";

// round_schedule_kind pgEnum과 같다. 어긋나면 satisfies가 컴파일을 막는다.
export const ROUND_SCHEDULE_KINDS = [
  "designated",
  "coordinated",
] as const satisfies readonly Game["roundScheduleKind"][];

export type RoundScheduleKind = (typeof ROUND_SCHEDULE_KINDS)[number];

export const ROUND_SCHEDULE_KIND = {
  designated: "designated",
  coordinated: "coordinated",
} as const satisfies Record<RoundScheduleKind, RoundScheduleKind>;
