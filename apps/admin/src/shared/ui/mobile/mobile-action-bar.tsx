import { FloatingBar, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface MobileActionBarProps {
  // 버튼 둘을 한 줄에 두려면 호출부가 HStack으로 감싼다.
  children: ReactNode;
}

// 모바일 화면 아래에 고정하는 조치 바. 시트가 열려 있는 동안은 FloatingBar가 스스로 숨는다.
export function MobileActionBar({ children }: MobileActionBarProps) {
  return (
    <FloatingBar.Root elevated={false}>
      <FloatingBar.Content className="max-w-none px-150 pt-125">
        <VStack gap="100">{children}</VStack>
      </FloatingBar.Content>
      <FloatingBar.Spacer />
    </FloatingBar.Root>
  );
}
