import { Callout } from "@roll-and-call/ui";

export function AuthErrorNotice() {
  return (
    <Callout.Root colorPalette="danger" size="sm">
      <Callout.Icon />
      <Callout.Description>
        로그인하지 못했습니다. 아래 버튼으로 다시 시도해 주세요.
      </Callout.Description>
    </Callout.Root>
  );
}
