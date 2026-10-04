import { HStack, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface DecisionFooterProps {
  children: ReactNode;
  status?: ReactNode;
  notice?: ReactNode;
}

export function DecisionFooter({ children, status, notice }: DecisionFooterProps) {
  return (
    <VStack
      gap="125"
      data-full-bleed
      className="sticky bottom-0 z-(--rc-z-sticky) border-t border-gray-200 bg-surface px-page py-150"
    >
      {notice}
      <HStack align="center" gap="125">
        {status}
        <HStack gap="100" className="ml-auto">
          {children}
        </HStack>
      </HStack>
    </VStack>
  );
}
