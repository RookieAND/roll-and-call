import { HStack, Text } from "@trpg/ui";
import type { ReactNode } from "react";

interface RosterGroupHeaderProps {
  label: string;
  count: number;
  capacity?: number;
  action?: ReactNode;
}

export function RosterGroupHeader({ label, count, capacity, action }: RosterGroupHeaderProps) {
  return (
    <HStack align="center" gap="100">
      <Text typography="heading3" render={<h2 />}>
        {label}
      </Text>
      <Text numeric typography="subtitle2">
        {count}명
      </Text>
      {capacity !== undefined && (
        <Text numeric typography="body4" foreground="hint">
          정원 {capacity}명
        </Text>
      )}
      <span className="flex-1" />
      {action}
    </HStack>
  );
}
