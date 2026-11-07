import { SESSION_ROLE, type SessionRole } from "@/entities/game";
import { ONGOING_CHIP, SESSION_CHIP, type SessionChipKey } from "@/widgets/session-list";

export const SUMMARY_TITLE = {
  [SESSION_ROLE.player]: "참여 세션 요약",
  [SESSION_ROLE.host]: "운영 세션 요약",
} as const satisfies Record<SessionRole, string>;

// 진행 중은 아래 줄들을 합친 수다. 확정 칩과 달리 조율 중과 확정을 나눠 센다.
export const SUMMARY_ROWS = {
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
} as const satisfies Record<SessionRole, ReadonlyArray<{ key: SessionChipKey; label: string }>>;
