import { Button, HStack, Text } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import Link from "next/link";

import { GateCard } from "@/shared/ui";

interface DeniedOtherServerViewProps {
  serverName: string | null;
  userAppUrl: string;
}

// 다른 서버의 운영진이 주소를 바꿔 들어온 경우다(D179). 어느 서버의 운영진도 아니면 DeniedView를 쓴다.
export function DeniedOtherServerView({ serverName, userAppUrl }: DeniedOtherServerViewProps) {
  const target = isNull(serverName) ? "이 서버의" : `${serverName} 서버의`;
  return (
    <GateCard>
      <Text
        typography="heading3"
        foreground="hint"
        aria-hidden
        className="mb-175 grid size-9.5 place-items-center rounded-400 bg-gray-100"
      >
        !
      </Text>
      <Text typography="heading2" render={<h1 />}>
        이 서버의 운영진이 아닙니다
      </Text>
      <Text typography="body3" foreground="hint" render={<p />} className="mt-100 mb-250">
        {target} 관리 화면은 이 서버 운영진만 열 수 있습니다.
      </Text>
      <HStack gap="100" justify="center">
        <Button render={<Link href="/" />}>내 서버로</Button>
        <Button variant="ghost" colorPalette="gray" render={<a href={userAppUrl} />}>
          사용자 앱으로
        </Button>
      </HStack>
    </GateCard>
  );
}
