import { Text } from "@trpg/ui";

import { formatDateTime } from "@/shared/lib";
import { StatusNotice } from "@/shared/ui";

interface SessionSetNoticeProps {
  confirmedAt: Date;
}

// 기한이 남았어도 시간이 정해지면 새 신청을 받지 않는다. 언제 하는지는 같이 알려준다.
export function SessionSetNotice({ confirmedAt }: SessionSetNoticeProps) {
  return (
    <StatusNotice tone="muted" className="text-left">
      <Text typography="body3" weight="bold" render={<p />}>
        세션 시간이 정해져 신청을 받지 않습니다
      </Text>
      <Text typography="body3" foreground="muted" render={<p />} className="mt-050">
        {formatDateTime(confirmedAt)}에 진행합니다.
      </Text>
    </StatusNotice>
  );
}
