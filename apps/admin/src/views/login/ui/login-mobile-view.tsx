import { Callout, Text, VStack } from "@roll-and-call/ui";

import { LoginButton } from "@/features/auth";
import { BrandMark, MobileGate } from "@/shared/ui";

import { LOGIN_NOTES } from "../model/login-notes";

interface LoginMobileViewProps {
  failed: boolean;
}

export function LoginMobileView({ failed }: LoginMobileViewProps) {
  if (failed) {
    return (
      <MobileGate>
        <BrandMark />
        <Text typography="body3" foreground="hint" className="mt-100 mb-250">
          어드민 · 서버 운영진 전용
        </Text>
        <Callout.Root colorPalette="danger" className="mb-200 text-left">
          <Callout.Icon />
          <Callout.Title>디스코드 로그인을 마치지 못했습니다</Callout.Title>
          <Callout.Description>다시 로그인해 주세요.</Callout.Description>
        </Callout.Root>
        <LoginButton label="디스코드로 다시 로그인" withIcon={false} className="h-12" />
        <Text typography="body4" foreground="hint" className="mt-150">
          계속 실패하면 서버 소유자에게 알려 주세요.
        </Text>
      </MobileGate>
    );
  }
  return (
    <MobileGate>
      <BrandMark />
      <Text typography="heading2" render={<h1 />} className="mt-250">
        운영진 로그인
      </Text>
      <Text typography="body3" foreground="muted" className="mt-075 mb-300 leading-[1.6]">
        서버 운영진만 들어올 수 있습니다.
        <br />
        디스코드 계정으로 로그인해 주세요.
      </Text>
      <LoginButton label="디스코드로 로그인" withIcon className="h-12" />
      <VStack
        render={<ul />}
        gap="075"
        className="mt-250 w-full border-t border-(--rc-color-border-subtle) pt-200 text-left"
      >
        {LOGIN_NOTES.map((note) => (
          <Text
            key={note}
            typography="body4"
            foreground="muted"
            render={<li />}
            className="leading-normal"
          >
            · {note}
          </Text>
        ))}
      </VStack>
    </MobileGate>
  );
}
