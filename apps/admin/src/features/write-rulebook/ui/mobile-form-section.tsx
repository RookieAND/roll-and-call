import { Text, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface MobileFormSectionProps {
  title: string;
  children: ReactNode;
}

export function MobileFormSection({ title, children }: MobileFormSectionProps) {
  return (
    <VStack
      gap="125"
      render={<section />}
      className="rounded-600 border border-gray-200 bg-surface px-175 py-150"
    >
      <Text typography="subtitle1" render={<h2 />}>
        {title}
      </Text>
      {children}
    </VStack>
  );
}
