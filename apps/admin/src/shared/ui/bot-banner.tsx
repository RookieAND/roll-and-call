import { HStack, Text } from "@roll-and-call/ui";
import { TriangleAlert } from "lucide-react";

// 봇이 서버에서 빠진 서버는 모든 화면 맨 위에 띄운다. 플랫폼 메뉴(전역 데이터)에서는 띄우지 않는다.
export function BotBanner() {
  return (
    <HStack
      align="center"
      gap="100"
      role="alert"
      className="shrink-0 border-b border-(--rc-color-border-danger) bg-(--rc-color-bg-danger-weak) px-225 py-100 text-(--rc-color-fg-danger)"
    >
      <TriangleAlert size={16} aria-hidden />
      <Text typography="body3" weight="bold" foreground="danger">
        봇이 서버에서 제거되어 디스코드 알림이 중단됐습니다. 데이터는 유지됩니다.
      </Text>
    </HStack>
  );
}
