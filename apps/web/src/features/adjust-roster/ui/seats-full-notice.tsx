import { HStack, Text } from "@trpg/ui";
import { CircleAlert } from "lucide-react";

// 자리를 비우는 일과 정원을 늘리는 일은 모두 참여자 관리 페이지에서 한다. 시트는 이유만 알린다.
export function SeatsFullNotice() {
  return (
    <HStack align="start" gap="125" className="mx-250 rounded-500 bg-notice-bg px-175 py-150">
      <CircleAlert size={16} aria-hidden className="mt-025 shrink-0 text-notice-ink" />
      <Text typography="body4" render={<p />} className="flex-1 text-notice-ink">
        남은 자리가 없습니다.
        <br />
        기존 참여자를 내보내야 새로 추가가 가능합니다
      </Text>
    </HStack>
  );
}
