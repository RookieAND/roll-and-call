import { Text } from "@trpg/ui";
import type { ReactNode } from "react";

export function ActionHint({ children }: { children: ReactNode }) {
  return (
    <Text typography="body4" foreground="hint" render={<p />} className="text-center">
      {children}
    </Text>
  );
}
