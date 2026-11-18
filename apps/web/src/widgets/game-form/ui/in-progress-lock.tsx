import { Text, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface InProgressLockProps {
  locked: boolean;
  // 시안이 한 줄을 붙이라고 한 칸만 true다.
  note?: boolean;
  children: ReactNode;
}

// inert로 안쪽 입력을 모두 비활성으로 만든다. 눌러지지도 초점이 가지도 않는다.
export function InProgressLock({ locked, note = false, children }: InProgressLockProps) {
  if (!locked) return children;
  return (
    <VStack gap="075">
      <VStack gap="250" inert className="opacity-45">
        {children}
      </VStack>
      {note && (
        <Text typography="body4" foreground="hint" render={<p />}>
          진행 중에는 바꿀 수 없습니다.
        </Text>
      )}
    </VStack>
  );
}
