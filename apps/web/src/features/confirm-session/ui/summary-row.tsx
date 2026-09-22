import { HStack, Text } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface SummaryRowProps {
  label: string;
  children: ReactNode;
}

export function SummaryRow({ label, children }: SummaryRowProps) {
  return (
    <HStack align="center" gap="125" className="border-t border-gray-200 bg-gray-50 px-175 py-150">
      <Text typography="body4" foreground="muted" render={<span />} className="whitespace-nowrap">
        {label}
      </Text>
      <span className="flex-1" />
      {children}
    </HStack>
  );
}
