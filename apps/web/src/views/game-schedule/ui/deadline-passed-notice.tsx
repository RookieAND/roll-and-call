import { Text } from "@trpg/ui";

import { StatusNotice } from "@/shared/ui";

export function DeadlinePassedNotice() {
  return (
    <StatusNotice tone="muted" className="text-left">
      <Text typography="subtitle2" render={<p />}>
        모집 기한이 지났습니다
      </Text>
      <Text typography="body4" foreground="muted" render={<p />} className="mt-0.5">
        GM이 세션 시간을 확정하는 중입니다. 가능 시간은 지금도 고칠 수 있습니다.
      </Text>
    </StatusNotice>
  );
}
