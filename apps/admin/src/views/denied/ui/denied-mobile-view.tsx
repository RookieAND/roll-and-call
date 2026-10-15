import { Button, HStack, Text } from "@roll-and-call/ui";

import { SwitchAccountButton } from "@/features/auth";
import { MobileGate } from "@/shared/ui";

interface DeniedMobileViewProps {
  nickname: string;
  userAppUrl: string;
}

export function DeniedMobileView({ nickname, userAppUrl }: DeniedMobileViewProps) {
  return (
    <MobileGate>
      <Text
        typography="heading3"
        foreground="hint"
        aria-hidden
        className="mx-auto mb-175 grid size-9.5 place-items-center rounded-400 bg-gray-100"
      >
        !
      </Text>
      <Text typography="heading2" render={<h1 />}>
        운영진만 이용할 수 있습니다
      </Text>
      <Text typography="body3" foreground="hint" render={<p />} className="mt-075 mb-250">
        {nickname} 계정으로 로그인했습니다. 권한이 필요하면 서버 소유자에게 문의해 주세요.
      </Text>
      <HStack gap="100">
        <SwitchAccountButton className="h-12 flex-1" />
        <Button
          variant="ghost"
          colorPalette="gray"
          render={<a href={userAppUrl} />}
          className="h-12 flex-1"
        >
          사용자 앱으로
        </Button>
      </HStack>
    </MobileGate>
  );
}
