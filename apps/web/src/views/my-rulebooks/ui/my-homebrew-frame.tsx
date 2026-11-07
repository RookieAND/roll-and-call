import { Text, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface MyHomebrewFrameProps {
  children: ReactNode;
}

export function MyHomebrewFrame({ children }: MyHomebrewFrameProps) {
  return (
    <VStack gap="150" render={<section />}>
      <Text typography="heading3" render={<h2 />}>
        내가 만든 룰
      </Text>
      {children}
    </VStack>
  );
}
