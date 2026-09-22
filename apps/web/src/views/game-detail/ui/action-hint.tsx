import { Text } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface ActionHintProps {
  children: ReactNode;
}

export function ActionHint({ children }: ActionHintProps) {
  return (
    <Text typography="body3" foreground="muted" render={<p />} className="text-center">
      {children}
    </Text>
  );
}
