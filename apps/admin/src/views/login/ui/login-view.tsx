import { Callout, Text, VStack } from "@roll-and-call/ui";

import { LoginButton } from "@/features/auth";
import { BrandMark, GateCard } from "@/shared/ui";

interface LoginViewProps {
  failed: boolean;
}

export function LoginView({ failed }: LoginViewProps) {
  const buttonLabel = failed ? "디스코드로 다시 로그인" : "디스코드로 로그인";
  return (
    <GateCard>
      <BrandMark />
      <Text
        typography="body3"
        foreground="hint"
        className={failed ? "mt-100 mb-250" : "mt-100 mb-300"}
      >
        어드민 · 서버 운영진 전용
      </Text>
      {failed ? (
        <Callout.Root colorPalette="danger" className="mb-200 text-left">
          <Callout.Icon />
          <Callout.Description>
            디스코드 로그인을 마치지 못했어요. 로그인 창을 닫았거나 권한 허용을 취소했다면 다시
            시도해 주세요.
          </Callout.Description>
        </Callout.Root>
      ) : null}
      <LoginButton label={buttonLabel} withIcon={!failed} />
      {failed ? (
        <VStack className="mt-150">
          <Text typography="body4" foreground="hint">
            계속 실패하면 서버 소유자에게 알려 주세요
          </Text>
        </VStack>
      ) : null}
    </GateCard>
  );
}
