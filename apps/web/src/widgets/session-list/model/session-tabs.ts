import { SESSION_ROLE, type SessionRole } from "@/entities/game";

import { SESSION_CHIP, type SessionChip } from "./session-card-model";

// 기본 칩은 전체가 아니라 "진행 중"이다. 전체로 두면 시간이 갈수록 목록이 기록으로 덮인다.
export const ONGOING_CHIP = "ongoing";

export type SessionChipKey = SessionChip | typeof ONGOING_CHIP;

// 진행 중은 따로 칩이 있는 조율 중·확정·종료를 뺀 나머지다. 같은 카드가 두 칩에 겹쳐 보이지 않게 한다.
export const ONGOING_EXCLUDED_CHIPS: ReadonlySet<SessionChip> = new Set([
  SESSION_CHIP.scheduling,
  SESSION_CHIP.confirmed,
  SESSION_CHIP.ended,
]);

export const SESSION_TABS = [
  { key: SESSION_ROLE.player, label: "참여" },
  { key: SESSION_ROLE.host, label: "운영" },
] as const satisfies ReadonlyArray<{ key: SessionRole; label: string }>;

export const SESSION_CHIPS: Record<
  SessionRole,
  ReadonlyArray<{ key: SessionChipKey; label: string }>
> = {
  [SESSION_ROLE.player]: [
    { key: ONGOING_CHIP, label: "진행 중" },
    { key: SESSION_CHIP.scheduling, label: "조율 중" },
    { key: SESSION_CHIP.confirmed, label: "확정" },
    { key: SESSION_CHIP.waiting, label: "대기" },
    { key: SESSION_CHIP.ended, label: "종료" },
  ],
  [SESSION_ROLE.host]: [
    { key: ONGOING_CHIP, label: "진행 중" },
    { key: SESSION_CHIP.recruiting, label: "모집 중" },
    { key: SESSION_CHIP.scheduling, label: "조율 중" },
    { key: SESSION_CHIP.confirmed, label: "확정" },
    { key: SESSION_CHIP.ended, label: "종료" },
  ],
};
