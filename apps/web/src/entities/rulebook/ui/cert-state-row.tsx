import { Badge, HStack, Text, VStack } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";
import { ChevronRight } from "lucide-react";

import { CERT_STATE, type CertState } from "../model/cert-state";
import { CERT_STATE_META } from "../model/cert-state-meta";
import { CertStateIcon } from "./cert-state-icon";

const BADGE_PALETTE = {
  success: "success",
  muted: "gray",
  warning: "warning",
  hint: "gray",
} as const;

const row = cva("flex items-center px-175", {
  variants: {
    size: {
      md: "min-h-[60px] gap-150 py-125",
      sm: "min-h-[48px] gap-125 py-100",
    },
  },
});

const ICON_SIZE = { md: 20, sm: 18 } as const;

interface CertStateRowProps {
  state: CertState;
  title: string;
  meta?: string;
  statusPlacement?: "inline" | "end" | "badge" | "none";
  // 화면마다 짧은 라벨을 쓸 때 덮어 쓴다(마이페이지 「인증」·「반려」).
  statusLabel?: string;
  chevron?: boolean;
  size?: "md" | "sm";
}

export function CertStateRow({
  state,
  title,
  meta,
  statusPlacement = "end",
  statusLabel,
  chevron = true,
  size = "md",
}: CertStateRowProps) {
  const { label: defaultLabel, foreground } = CERT_STATE_META[state];
  const label = statusLabel ?? defaultLabel;
  const metaForeground = state === CERT_STATE.rejected ? "warning" : "hint";
  const status = (
    <Text typography="body4" weight="bold" foreground={foreground} className="flex-none">
      {label}
    </Text>
  );

  return (
    <div className={row({ size })}>
      <CertStateIcon state={state} size={ICON_SIZE[size]} />
      <VStack gap="025" className="min-w-0 flex-1">
        <HStack align="baseline" gap="075">
          <Text typography="body2" weight="bold" foreground="normal" truncate>
            {title}
          </Text>
          {statusPlacement === "inline" && status}
        </HStack>
        {meta && (
          <Text typography="body4" foreground={metaForeground} truncate>
            {meta}
          </Text>
        )}
      </VStack>
      {statusPlacement === "end" && status}
      {statusPlacement === "badge" && (
        <Badge colorPalette={BADGE_PALETTE[foreground]} className="flex-none">
          {label}
        </Badge>
      )}
      {chevron && <ChevronRight size={16} aria-hidden className="flex-none text-hint" />}
    </div>
  );
}
