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

const row = cva("flex min-h-[52px] items-center gap-150 px-175 py-125", {
  variants: { rejected: { true: "bg-warning-50", false: "" } },
});

interface CertStateRowProps {
  state: CertState;
  title: string;
  meta?: string;
  // 제목 옆(목록)에 글자로, 오른쪽 끝에 글자나 배지(마이페이지 블록)로 둔다. 없으면 아이콘만.
  statusPlacement?: "inline" | "end" | "badge" | "none";
  chevron?: boolean;
}

// 룰북 하나와 내 인증 상태. 링크는 감싸는 쪽이 준다.
export function CertStateRow({
  state,
  title,
  meta,
  statusPlacement = "end",
  chevron = true,
}: CertStateRowProps) {
  const { label, foreground } = CERT_STATE_META[state];
  const titleForeground = state === CERT_STATE.revoked ? "hint" : "normal";
  const metaForeground = state === CERT_STATE.rejected ? "warning" : "hint";
  const status = (
    <Text typography="body4" weight="bold" foreground={foreground} className="flex-none">
      {label}
    </Text>
  );

  return (
    <div className={row({ rejected: state === CERT_STATE.rejected })}>
      <CertStateIcon state={state} />
      <VStack gap="025" className="min-w-0 flex-1">
        <HStack align="baseline" gap="075">
          <Text typography="body2" weight="bold" foreground={titleForeground} truncate>
            {title}
          </Text>
          {statusPlacement === "inline" && status}
        </HStack>
        {meta && (
          <Text typography="body4" foreground={metaForeground}>
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
