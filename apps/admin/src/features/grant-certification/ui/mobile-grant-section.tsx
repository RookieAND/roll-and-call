import { HStack, Text, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface MobileGrantSectionProps {
  title: string;
  description?: string;
  tag?: ReactNode;
  children: ReactNode;
}

export function MobileGrantSection({ title, description, tag, children }: MobileGrantSectionProps) {
  return (
    <VStack
      gap="125"
      render={<section />}
      className="rounded-600 border border-gray-200 bg-surface px-175 py-150"
    >
      <HStack align="start" gap="100">
        <VStack gap="025" className="min-w-0 flex-1">
          <Text typography="heading3" render={<h2 />}>
            {title}
          </Text>
          {description ? (
            <Text typography="body4" foreground="muted" className="break-keep">
              {description}
            </Text>
          ) : null}
        </VStack>
        {tag}
      </HStack>
      {children}
    </VStack>
  );
}
