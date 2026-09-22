import { Callout } from "@roll-and-call/ui";

export function EditWithoutApplicantsNotice() {
  return (
    <Callout.Root>
      <Callout.Description>
        아직 신청자가 없습니다.
        <br />
        모든 항목을 바꿀 수 있고, 저장하면 디스코드 공지도 다시 올라갑니다.
      </Callout.Description>
    </Callout.Root>
  );
}
