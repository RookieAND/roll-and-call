import { CONFIRMED_LEAVE_BLOCK, type ConfirmedLeaveBlock } from "@/entities/game";

export const LEAVE_LOCKED_REASON: Record<Exclude<ConfirmedLeaveBlock, "schedule">, string> = {
  [CONFIRMED_LEAVE_BLOCK.drawn]: "추첨이 끝나",
  [CONFIRMED_LEAVE_BLOCK.expired]: "모집이 마감되어",
  [CONFIRMED_LEAVE_BLOCK.full]: "정원이 차서",
};
