import type { ReactNode } from "react";

import { cn } from "./cn";
import { Text } from "./text";

export interface RadioCardDescriptionProps {
  className?: string;
  children: ReactNode;
}

export function RadioCardDescription({ className, children }: RadioCardDescriptionProps) {
  return (
    <Text
      data-slot="radio-card-description"
      typography="body4"
      className={cn("col-start-1 text-gray-600", className)}
    >
      {children}
    </Text>
  );
}
