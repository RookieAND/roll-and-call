import type { ReactNode } from "react";

import { cn } from "../../lib/cn";
import { Text } from "../text/text";

export interface RadioCardTitleProps {
  className?: string;
  children: ReactNode;
}

export function RadioCardTitle({ className, children }: RadioCardTitleProps) {
  return (
    <Text
      data-slot="radio-card-title"
      typography="subtitle1"
      className={cn("col-start-1 row-start-1", className)}
    >
      {children}
    </Text>
  );
}
