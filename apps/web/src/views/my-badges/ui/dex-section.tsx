import { HStack, Text, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface DexSectionProps {
  title: string;
  hint?: string;
  children: ReactNode;
}

export function DexSection({ title, hint, children }: DexSectionProps) {
  return (
    <VStack gap="150" render={<section />} className="px-200 pt-225 pb-100">
      <HStack align="baseline">
        <Text typography="heading3" render={<h2 />} className="flex-1">
          {title}
        </Text>
        {hint && (
          <Text typography="body4" foreground="hint" numeric>
            {hint}
          </Text>
        )}
      </HStack>
      {children}
    </VStack>
  );
}
