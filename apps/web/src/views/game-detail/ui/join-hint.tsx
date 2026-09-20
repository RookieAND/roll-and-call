import { Text } from "@trpg/ui";
import type { ReactNode } from "react";

interface JoinHintProps {
  children: ReactNode;
}

// 신청 버튼 위 한 줄은 막다른 길 안내(ActionHint)보다 한 단 작고 옅다.
export function JoinHint({ children }: JoinHintProps) {
  return (
    <Text typography="body4" foreground="hint" render={<p />} className="text-center">
      {children}
    </Text>
  );
}
