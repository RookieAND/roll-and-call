import { cva } from "class-variance-authority";

import type { CertState } from "../model/cert-state";
import { CERT_STATE_META } from "../model/cert-state-meta";

const icon = cva("flex-none", {
  variants: {
    foreground: {
      success: "text-success-700",
      muted: "text-gray-600",
      warning: "text-warning-600",
      hint: "text-hint",
    },
  },
});

interface CertStateIconProps {
  state: CertState;
  size?: number;
}

export function CertStateIcon({ state, size = 20 }: CertStateIconProps) {
  const { icon: Icon, foreground } = CERT_STATE_META[state];
  return <Icon size={size} strokeWidth={2.2} aria-hidden className={icon({ foreground })} />;
}
