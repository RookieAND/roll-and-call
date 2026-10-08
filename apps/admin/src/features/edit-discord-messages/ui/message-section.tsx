import { HStack, Text, VStack, cn } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface MessageSectionProps {
  title: string;
  hint?: string;
  first?: boolean;
  gap?: "100" | "150";
  children: ReactNode;
}

export function MessageSection({ title, hint, first, gap = "100", children }: MessageSectionProps) {
  return (
    <VStack gap={gap} className={cn(!first && "border-t border-(--rc-color-border-subtle) pt-200")}>
      <HStack align="baseline" gap="100">
        <Text typography="subtitle2" render={<h3 />}>
          {title}
        </Text>
        {hint ? (
          <Text typography="body4" foreground="hint">
            {hint}
          </Text>
        ) : null}
      </HStack>
      {children}
    </VStack>
  );
}
