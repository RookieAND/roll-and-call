import { Badge } from "@roll-and-call/ui";

import type { GmCertState } from "@/shared/server";

const STATE_BADGE = {
  unapplied: { colorPalette: "danger", label: "미신청" },
  pending: { colorPalette: "warning", label: "심사 대기" },
  certified: { colorPalette: "success", label: "인증 완료" },
} as const;

interface GmCertStateBadgeProps {
  state: GmCertState;
}

export function GmCertStateBadge({ state }: GmCertStateBadgeProps) {
  const badge = STATE_BADGE[state];
  return <Badge colorPalette={badge.colorPalette}>{badge.label}</Badge>;
}
