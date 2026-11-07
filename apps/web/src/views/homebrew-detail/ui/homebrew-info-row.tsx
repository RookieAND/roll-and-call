import { HStack, Text } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface HomebrewInfoRowProps {
  label: string;
  children: ReactNode;
  action?: ReactNode;
}

export function HomebrewInfoRow({ label, children, action }: HomebrewInfoRowProps) {
  return (
    <HStack align="center" gap="150" className="min-h-12 px-200 py-125">
      <Text typography="body4" foreground="hint" className="w-[74px] flex-none">
        {label}
      </Text>
      <HStack align="center" className="min-w-0 flex-1">
        {children}
      </HStack>
      {action}
    </HStack>
  );
}
