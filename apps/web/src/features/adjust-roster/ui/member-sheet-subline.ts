import { isNull } from "es-toolkit";

import type { MemberSummary } from "../model/member-summary";
import { queueLabel } from "./queue-label";

export function memberSheetSubline({
  member,
  beforeDraw,
  started,
}: {
  member: MemberSummary;
  beforeDraw: boolean;
  started: boolean;
}): { text: string; foreground: "muted" } {
  if (started && isNull(member.waitlistRank)) {
    return { text: "확정 · 세션 중", foreground: "muted" };
  }
  return {
    text: queueLabel({ waitlistRank: member.waitlistRank, beforeDraw }),
    foreground: "muted",
  };
}
