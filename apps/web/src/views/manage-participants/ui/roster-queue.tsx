import { HStack, Text, VStack } from "@trpg/ui";
import type { ReactNode } from "react";

export function RosterQueue({
  label,
  count,
  caption,
  footnote,
  children,
}: {
  label: string;
  count: number;
  caption?: string;
  footnote?: ReactNode;
  children: ReactNode;
}) {
  return (
    <VStack gap={2}>
      <HStack align="baseline" gap={2}>
        <Text typography="subtitle1" render={<h2 />}>
          {label}
        </Text>
        <Text typography="subtitle1" foreground="muted" className="flex-1 tabular-nums">
          {count}명
        </Text>
        {caption && (
          <Text typography="body4" foreground="hint">
            {caption}
          </Text>
        )}
      </HStack>
      <div className="overflow-hidden rounded-xl border border-gray-200">{children}</div>
      {footnote}
    </VStack>
  );
}
