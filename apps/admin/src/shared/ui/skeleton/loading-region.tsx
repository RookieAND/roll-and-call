import { VStack, cn } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface LoadingRegionProps {
  label: string;
  className?: string;
  fullBleed?: boolean;
  children: ReactNode;
}

export function LoadingRegion({ label, className, fullBleed, children }: LoadingRegionProps) {
  return (
    <VStack
      data-full-bleed={fullBleed || undefined}
      aria-busy
      aria-live="polite"
      className={cn("min-h-0 flex-1", className)}
    >
      <span className="sr-only">{label}</span>
      {children}
    </VStack>
  );
}
