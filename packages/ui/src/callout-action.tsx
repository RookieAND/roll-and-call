import type { ReactNode } from "react";

import { cn } from "./cn";

export interface CalloutActionProps {
  className?: string;
  children: ReactNode;
}

export function CalloutAction({ className, children }: CalloutActionProps) {
  return (
    <div
      data-slot="callout-action"
      className={cn("col-start-3 row-span-2 ml-100 flex-none self-center", className)}
    >
      {children}
    </div>
  );
}
