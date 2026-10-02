import type { GmCertState } from "@/shared/server";
import { Tag } from "@/shared/ui";

const STATE_TAG = {
  unapplied: { tone: "warning", label: "미신청" },
  pending: { tone: "warning", label: "심사 대기" },
  certified: { tone: "success", label: "인증 완료" },
} as const;

interface GmCertStateBadgeProps {
  state: GmCertState;
}

export function GmCertStateBadge({ state }: GmCertStateBadgeProps) {
  const tag = STATE_TAG[state];
  return <Tag tone={tag.tone}>{tag.label}</Tag>;
}
