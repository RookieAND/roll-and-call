import { Callout } from "@roll-and-call/ui";

// 자리를 비우는 일과 정원을 늘리는 일은 모두 참여자 관리 페이지에서 한다. 시트는 이유만 알린다.
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
