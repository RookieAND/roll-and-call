import { HStack, Text, VStack } from "@trpg/ui";

import { LoginButton } from "@/features/auth";
import { StatusNotice, ThemeSetting } from "@/shared/ui";

// ponytail: 그라디언트 배경과 두 줄 각주를 걷어냈다. 표제·한 문장·버튼만 남긴다.
export function LandingHero({ authError }: { authError: boolean }) {
  return (
    <div className="px-6 pt-11 pb-2">
      <VStack gap={4}>
        <HStack gap={2} align="center">
          <span className="h-[26px] w-[26px] rounded-lg bg-primary-600" />
          <Text typography="heading3" className="flex-1">
            롤앤콜
          </Text>
          <ThemeSetting />
        </HStack>
        {authError && (
          <StatusNotice tone="muted" className="text-left">
            로그인하지 못했습니다. 아래 버튼으로 다시 시도해 주세요.
          </StatusNotice>
        )}
        <Text typography="display1" render={<h1 />} className="leading-snug tracking-[-0.035em]">
          TRPG 세션, 모집부터
          <br />
          일정 확정까지 한 곳에서
        </Text>
        <Text foreground="muted" className="leading-relaxed">
          구인 글을 올려 플레이어를 모으고, 서로 가능한 시간을 겹쳐 세션 일시를 정합니다.
        </Text>
        <LoginButton className="w-full" next="/" />
        <Text typography="body4" foreground="hint" className="text-center">
          디스코드 계정으로 시작합니다. 닉네임과 아바타만 가져옵니다.
        </Text>
      </VStack>
    </div>
  );
}
