import type { Game } from "@roll-and-call/database";

export type MultiRoundGame = Pick<
  Game,
  "roundCount" | "roundScheduleKind" | "repeatRule" | "confirmedAt" | "rangeStart" | "rangeEnd"
>;
