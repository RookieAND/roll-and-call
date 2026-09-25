import { HStack, Text, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface ContentSectionProps {
  title: string;
  right?: ReactNode;
  children: ReactNode;
}

export function ContentSection({ title, right, children }: ContentSectionProps) {
  return (
    <VStack
      gap="100"
      render={<section />}
      className="border-t border-(--rc-color-border-subtle) py-175 first:border-t-0"
    >
      <HStack align="center" gap="100">
        <Text typography="heading3" render={<h3 />}>
          {title}
        </Text>
        {right}
      </HStack>
      {children}
    </VStack>
  );
}
