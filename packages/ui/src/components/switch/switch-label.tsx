import type { ReactNode } from "react";

import { cn } from "../../lib/cn";
import { Text } from "../text/text";

export interface SwitchLabelProps {
  className?: string;
  children: ReactNode;
}

export function SwitchLabel({ className, children }: SwitchLabelProps) {
  return (
    <Text data-slot="switch-label" typography="subtitle1" className={cn("min-w-0", className)}>
      {children}
    </Text>
  );
}
