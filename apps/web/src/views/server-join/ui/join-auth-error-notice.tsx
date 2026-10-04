import { Callout } from "@roll-and-call/ui";

export function JoinAuthErrorNotice() {
  return (
    <Callout.Root colorPalette="gray" size="sm">
      <Callout.Icon />
      <Callout.Description>
        디스코드 로그인을 마치지 못했습니다.
        <br />
        아래 버튼으로 다시 시도해 주세요.
      </Callout.Description>
    </Callout.Root>
  );
}
