import { isNull } from "es-toolkit";

import { availabilityNote } from "@/entities/game";

import type { MemberSummary } from "../model/member-summary";
import { queueLabel } from "./queue-label";

export function memberSheetSubline({
  member,
  isCoordinate,
  beforeDraw,
  started,
}: {
  member: MemberSummary;
  isCoordinate: boolean;
  beforeDraw: boolean;
  started: boolean;
}): { text: string; foreground: "muted" | "warning" } {
  if (started && isNull(member.waitlistRank)) {
    return { text: "확정 · 세션 중", foreground: "muted" };
  }
  const queue = queueLabel({ waitlistRank: member.waitlistRank, beforeDraw });
  if (!isCoordinate) return { text: queue, foreground: "muted" };
  return {
    text: `${queue} · ${availabilityNote(member.hasAvailability)}`,
    foreground: member.hasAvailability ? "muted" : "warning",
  };
}
