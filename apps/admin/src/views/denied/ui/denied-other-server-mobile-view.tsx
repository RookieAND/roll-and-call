import { Button, HStack, Text } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import Link from "next/link";

import { MobileGate } from "@/shared/ui";

interface DeniedOtherServerMobileViewProps {
  serverName: string | null;
  userAppUrl: string;
}

export function DeniedOtherServerMobileView({
  serverName,
  userAppUrl,
}: DeniedOtherServerMobileViewProps) {
  const target = isNull(serverName) ? "이 서버의" : `${serverName} 서버의`;
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
        이 서버의 운영진이 아닙니다
      </Text>
      <Text typography="body3" foreground="hint" render={<p />} className="mt-075 mb-250">
        {target} 관리 화면은 이 서버 운영진만 열 수 있습니다.
      </Text>
      <HStack gap="100">
        <Button render={<Link href="/" />} className="h-12 flex-1">
          내 서버로
        </Button>
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
