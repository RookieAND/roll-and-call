import { HStack, Text } from "@trpg/ui";
import type { ReactNode } from "react";

export function RosterGroupHeader({
  label,
  count,
  capacity,
  action,
}: {
  label: string;
  count: number;
  capacity?: number;
  action?: ReactNode;
}) {
  return (
    <HStack align="center" gap={2}>
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
