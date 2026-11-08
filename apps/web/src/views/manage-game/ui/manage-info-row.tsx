import { HStack, Text } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface ManageInfoRowProps {
  label: string;
  children: ReactNode;
}

export function ManageInfoRow({ label, children }: ManageInfoRowProps) {
  return (
    <HStack align="center" gap="100" className="min-h-10">
      <Text typography="body3" foreground="muted" className="flex-1">
        {label}
      </Text>
      {children}
    </HStack>
  );
}
