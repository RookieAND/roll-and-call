import { Text, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface ResultSectionProps {
  label: string;
  children: ReactNode;
}

export function ResultSection({ label, children }: ResultSectionProps) {
  return (
    <VStack render={<section />}>
      <div aria-hidden className="h-100 bg-canvas" />
      <VStack gap="100" className="px-200 py-225">
        <Text typography="body3" weight="bold" foreground="muted" render={<h3 />}>
          {label}
        </Text>
        {children}
      </VStack>
    </VStack>
  );
}
