import { HStack, Text } from "@trpg/ui";
import { CircleAlert } from "lucide-react";

import { StatusNotice } from "@/shared/ui";

export function UnrespondedNotice() {
  return (
    <StatusNotice tone="muted" className="text-left">
      <HStack align="center" gap="100">
        <CircleAlert size={15} className="shrink-0 text-warning-600" aria-hidden />
        <Text typography="subtitle2" foreground="warning">
          아직 가능 시간을 내지 않았습니다
        </Text>
      </HStack>
      <Text typography="body3" foreground="muted" render={<p />} className="mt-075">
        일정 조율에서 가능한 시간을 입력하세요.
      </Text>
    </StatusNotice>
  );
}
