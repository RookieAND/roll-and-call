import { Text } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface JoinHintProps {
  children: ReactNode;
}

export function JoinHint({ children }: JoinHintProps) {
  return (
    <Text typography="body4" foreground="hint" render={<p />} className="text-center text-pretty break-keep">
      {children}
    </Text>
  );
}
