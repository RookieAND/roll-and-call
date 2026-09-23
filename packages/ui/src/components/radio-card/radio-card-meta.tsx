import type { ReactNode } from "react";

import { cn } from "../../lib/cn";
import { Text } from "../text/text";

export interface RadioCardMetaProps {
  className?: string;
  children: ReactNode;
}

export function RadioCardMeta({ className, children }: RadioCardMetaProps) {
  return (
    <Text
      data-slot="radio-card-meta"
      typography="body4"
      className={cn("col-start-1 text-hint", className)}
    >
      {children}
    </Text>
  );
}
