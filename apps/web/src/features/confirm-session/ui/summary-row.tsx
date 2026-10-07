import { HStack, Text } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface SummaryRowProps {
  label: string;
  children: ReactNode;
}

export function SummaryRow({ label, children }: SummaryRowProps) {
  return (
    <HStack align="center" gap="125" className="min-h-10 px-175">
      <Text typography="body4" foreground="hint" render={<span />} className="flex-1">
        {label}
      </Text>
      {children}
    </HStack>
  );
}
