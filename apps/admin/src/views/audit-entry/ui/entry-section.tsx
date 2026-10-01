import { HStack, Text, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface EntrySectionProps {
  title: string;
  right?: ReactNode;
  children: ReactNode;
}

export function EntrySection({ title, right, children }: EntrySectionProps) {
  return (
    <VStack gap="125" render={<section />} className="px-200 py-175">
      <HStack align="center" gap="100">
        <Text typography="heading3" render={<h3 />}>
          {title}
        </Text>
        {right ? <div className="ml-auto">{right}</div> : null}
      </HStack>
      {children}
    </VStack>
  );
}
