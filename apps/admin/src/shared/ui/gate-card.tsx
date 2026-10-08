import { cn, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface GateCardProps {
  children: ReactNode;
  wide?: boolean;
}

export function GateCard({ children, wide }: GateCardProps) {
  return (
    <main className="grid min-h-dvh place-items-center bg-canvas p-200">
      <VStack
        align="center"
        className={cn(
          "w-full rounded-800 border border-gray-200 bg-surface p-400 text-center",
          wide ? "max-w-[440px]" : "max-w-[420px]",
        )}
      >
        {children}
      </VStack>
    </main>
  );
}
