import { HStack, Text } from "@trpg/ui";
import { CircleAlert } from "lucide-react";

export function EditWithApplicantsNotice() {
  return (
    <div className="rounded-500 border border-danger-200 bg-danger-50 px-175 py-150">
      <HStack align="center" gap="075">
        <CircleAlert
          size={15}
          strokeWidth={2.2}
          aria-hidden
          className="flex-none text-danger-600"
        />
        <Text typography="subtitle2" foreground="danger" render={<p />}>
          신청자가 존재하여 수정이 일부 제한됩니다
        </Text>
      </HStack>
      <Text
        typography="body4"
        foreground="muted"
        render={<p />}
        className="mt-075 text-pretty leading-[1.55]"
      >
        모집 방식과 일정 방식은 <b>더 이상 변경할 수 없습니다.</b>
        <br />그 외 나머지 항목은 수정 후 저장 시 바로 반영됩니다.
      </Text>
    </div>
  );
}
