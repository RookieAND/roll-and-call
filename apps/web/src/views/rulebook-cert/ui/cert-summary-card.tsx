import { HStack, Text, VStack } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";

import { CERT_STATE_META, CertStateIcon, type CertState } from "@/entities/rulebook";
import { LineBreaks } from "@/shared/ui";

const card = cva("rounded-600 p-200", {
  variants: {
    state: {
      certified: "bg-success-50",
      pending: "bg-gray-50",
      rejected: "bg-warning-50",
      revoked: "bg-gray-100",
      requested: "bg-gray-50",
    },
  },
});

interface CertSummaryCardProps {
  state: CertState;
  lines: string[];
  sub: string[];
}

export function CertSummaryCard({ state, lines, sub }: CertSummaryCardProps) {
  const { label, foreground } = CERT_STATE_META[state];
  return (
    <VStack gap="100" className={card({ state })}>
      <HStack align="center" gap="100">
        <CertStateIcon state={state} size={22} />
        <Text typography="heading3" weight="extrabold" foreground={foreground}>
          {label}
        </Text>
      </HStack>
      <Text typography="body3" render={<p />} className="[text-wrap:pretty]">
        <LineBreaks lines={lines} />
      </Text>
      {sub.length > 0 && (
        <Text typography="body4" foreground="muted" render={<p />} className="[text-wrap:pretty]">
          <LineBreaks lines={sub} />
        </Text>
      )}
    </VStack>
  );
}
