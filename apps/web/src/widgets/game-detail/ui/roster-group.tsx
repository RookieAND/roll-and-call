import { Card, cn, HStack, Text, VStack } from "@roll-and-call/ui";
import { isUndefined } from "es-toolkit";
import type { ReactNode } from "react";

interface RosterGroupProps {
  label?: string;
  count?: number;
  children: ReactNode;
  className?: string;
}

export function RosterGroup({ label, count, children, className }: RosterGroupProps) {
  return (
    <VStack gap="075" render={<section />}>
      {label && (
        <HStack align="baseline" gap="075">
          <Text typography="body4" weight="bold" foreground="muted">
            {label}
          </Text>
          {!isUndefined(count) && (
            <Text numeric typography="body4" foreground="hint">
              {count}명
            </Text>
          )}
        </HStack>
      )}
      <Card.Root
        padding="none"
        radius={500}
        className={cn("overflow-hidden [&>*+*]:border-t [&>*+*]:border-gray-200", className)}
      >
        {children}
      </Card.Root>
    </VStack>
  );
}
