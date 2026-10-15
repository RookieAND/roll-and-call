import { HStack, Text, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface MobileEntrySectionProps {
  title?: string;
  right?: ReactNode;
  children: ReactNode;
}

export function MobileEntrySection({ title, right, children }: MobileEntrySectionProps) {
  return (
    <VStack
      gap="075"
      render={<section />}
      className="rounded-600 border border-gray-200 bg-surface px-175 py-150"
    >
      {title ? (
        <HStack align="center" gap="100">
          <Text typography="heading3" render={<h2 />}>
            {title}
          </Text>
          {right ? <div className="ml-auto">{right}</div> : null}
        </HStack>
      ) : null}
      {children}
    </VStack>
  );
}
