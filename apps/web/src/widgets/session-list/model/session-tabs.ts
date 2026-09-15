import {
  SESSION_BUCKET,
  SESSION_CHIP,
  type SessionBucket,
  type SessionChip,
} from "./session-card-model";

export const SESSION_TABS = [
  { key: SESSION_BUCKET.joined, label: "참여 중" },
  { key: SESSION_BUCKET.hosted, label: "내가 운영" },
  { key: SESSION_BUCKET.past, label: "끝남" },
] as const satisfies ReadonlyArray<{ key: SessionBucket; label: string }>;

export const SESSION_CHIPS: Record<
  SessionBucket,
  ReadonlyArray<{ key: SessionChip | "all"; label: string }>
> = {
  [SESSION_BUCKET.joined]: [
    { key: "all", label: "전체" },
    { key: SESSION_CHIP.scheduling, label: "조율 중" },
    { key: SESSION_CHIP.confirmed, label: "확정" },
    { key: SESSION_CHIP.waiting, label: "대기" },
  ],
  [SESSION_BUCKET.hosted]: [
    { key: "all", label: "전체" },
    { key: SESSION_CHIP.recruiting, label: "모집 중" },
    { key: SESSION_CHIP.confirmed, label: "확정" },
  ],
  [SESSION_BUCKET.past]: [],
};
