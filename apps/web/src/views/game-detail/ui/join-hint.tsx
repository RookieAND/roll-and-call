import { Text } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface JoinHintProps {
  children: ReactNode;
}

// 신청 버튼 위 한 줄 안내.
export function JoinHint({ children }: JoinHintProps) {
  return (
    <Text typography="body4" foreground="hint" render={<p />} className="text-center">
      {children}
    </Text>
  );
}
