import { VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface GateCardProps {
  children: ReactNode;
}

// 로그인·권한 없음처럼 앱 틀 바깥에서 한 장만 띄우는 카드.
export function GateCard({ children }: GateCardProps) {
  return (
    <main className="grid min-h-dvh place-items-center bg-canvas p-200">
      <VStack
        align="center"
        className="w-full max-w-[420px] rounded-800 border border-gray-200 bg-surface p-400 text-center"
      >
        {children}
      </VStack>
    </main>
  );
}
