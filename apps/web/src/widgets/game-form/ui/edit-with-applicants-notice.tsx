import { Callout } from "@roll-and-call/ui";
import { CircleAlert } from "lucide-react";

export function EditWithApplicantsNotice() {
  return (
    <Callout.Root colorPalette="danger">
      <Callout.Icon>
        <CircleAlert size={15} strokeWidth={2.2} />
      </Callout.Icon>
      <Callout.Title>신청자가 존재하여 수정이 일부 제한됩니다</Callout.Title>
      <Callout.Description>
        모집 방식과 일정 방식은 <b>더 이상 변경할 수 없습니다.</b>
        <br />그 외 나머지 항목은 수정 후 저장 시 바로 반영됩니다.
      </Callout.Description>
    </Callout.Root>
  );
}
