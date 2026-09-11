import { HStack, Text, VStack } from "@trpg/ui";
import { LoginButton } from "@/features/auth";

// 첫 화면: 무엇을 하는 서비스인지 한 문장, 그리고 바로 로그인.
export function LandingHero() {
  return (
    <div className="bg-[linear-gradient(180deg,#F7F7FE,#FFFFFF)] px-6 pt-11 pb-[34px]">
      <VStack gap={4}>
        <HStack gap={2} align="center">
          <span className="h-[26px] w-[26px] rounded-lg bg-primary-600" />
          <Text typography="heading3">롤앤콜</Text>
        </HStack>
        <Text typography="display1" render={<h1 />} className="leading-snug tracking-[-0.035em]">
          TRPG 세션, 모집부터
          <br />
          일정 확정까지 한 곳에서
        </Text>
        <Text foreground="muted" className="leading-relaxed">
          구인 글을 올려 플레이어를 모으고, 서로 가능한 시간을 겹쳐 세션 일시를 정합니다.
        </Text>
        <LoginButton className="w-full" />
        <Text typography="body4" foreground="muted" className="text-center leading-relaxed">
          별도 가입 없이 디스코드 계정으로 시작합니다.
          <br />
          닉네임과 아바타만 가져옵니다.
        </Text>
      </VStack>
    </div>
  );
}
