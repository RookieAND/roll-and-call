import { CircleCheck, Hourglass, X } from "lucide-react";

import type { GmCertState } from "@/shared/server";
import { IconBadge } from "@/shared/ui";

const STATE_BADGE = {
  unapplied: { icon: X, colorPalette: "danger", label: "미신청" },
  pending: { icon: Hourglass, colorPalette: "warning", label: "심사 대기" },
  certified: { icon: CircleCheck, colorPalette: "success", label: "인증 완료" },
} as const;

interface GmCertStateBadgeProps {
  state: GmCertState;
}

export function GmCertStateBadge({ state }: GmCertStateBadgeProps) {
  const badge = STATE_BADGE[state];
  return (
    <IconBadge icon={badge.icon} colorPalette={badge.colorPalette}>
      {badge.label}
    </IconBadge>
  );
}
