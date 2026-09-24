import { Button, HStack, Text } from "@roll-and-call/ui";

import { SwitchAccountButton } from "@/features/auth";
import { GateCard } from "@/shared/ui";

interface DeniedViewProps {
  nickname: string;
  userAppUrl: string;
}

export function DeniedView({ nickname, userAppUrl }: DeniedViewProps) {
  return (
    <GateCard>
      <Text
        typography="heading3"
        foreground="hint"
        aria-hidden
        className="mb-175 grid size-[38px] place-items-center rounded-400 bg-gray-100"
      >
        !
      </Text>
      <Text typography="heading2" render={<h1 />}>
        운영진만 이용할 수 있어요
      </Text>
      <Text typography="body3" foreground="hint" render={<p />} className="mt-100 mb-250">
        {nickname} 계정으로 로그인했습니다.
        <br />
        권한이 필요하면 서버 소유자에게 문의해 주세요.
      </Text>
      <HStack gap="100" justify="center">
        <SwitchAccountButton />
        <Button variant="ghost" colorPalette="gray" render={<a href={userAppUrl} />}>
          사용자 앱으로
        </Button>
      </HStack>
    </GateCard>
  );
}
