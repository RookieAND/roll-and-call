import { Callout } from "@roll-and-call/ui";

export function SeatsFullNotice() {
  return (
    <Callout.Root colorPalette="warning" className="mx-250">
      <Callout.Icon />
      <Callout.Description>
        남은 자리가 없습니다.
        <br />
        기존 참여자를 내보내야 새로 추가가 가능합니다
      </Callout.Description>
    </Callout.Root>
  );
}
