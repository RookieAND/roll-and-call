import { Badge, HStack, Text } from "@roll-and-call/ui";
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
      <Text numeric typography="heading3" weight="extrabold">
        {count}명
      </Text>
      {capacity !== undefined && <Badge className="tabular-nums">정원 {capacity}명</Badge>}
      <span className="flex-1" />
      {action}
    </HStack>
  );
}
