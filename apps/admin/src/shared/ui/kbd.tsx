import { Text } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface KbdProps {
  children: ReactNode;
}

export function Kbd({ children }: KbdProps) {
  return (
    <Text
      typography="body4"
      weight="bold"
      foreground="muted"
      tight
      render={<kbd />}
      className="inline-flex items-center rounded-200 border border-gray-200 bg-gray-100 px-075 py-025 font-sans"
    >
      {children}
    </Text>
  );
}
