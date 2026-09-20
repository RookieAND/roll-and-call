import { Text } from "@trpg/ui";
import type { ReactNode } from "react";

export function ActionHint({ children }: { children: ReactNode }) {
  return (
    <Text typography="body3" foreground="muted" render={<p />} className="text-center">
      {children}
    </Text>
  );
}
