import { Text, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface DecisionCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function DecisionCard({ title, description, children }: DecisionCardProps) {
  return (
    <VStack
      gap="100"
      render={<section />}
      className="rounded-600 border border-gray-200 bg-surface p-175"
    >
      <Text typography="heading3" render={<h2 />}>
        {title}
      </Text>
      <Text typography="body4" foreground="hint">
        {description}
      </Text>
      <VStack className="mt-050">{children}</VStack>
    </VStack>
  );
}
