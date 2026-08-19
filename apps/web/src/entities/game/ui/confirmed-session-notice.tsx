import { Text } from "@trpg/ui";
import { formatDateTime } from "@/shared/lib/format";
import { StatusNotice } from "@/shared/ui/status-notice";

// 순수 표시: 확정된 세션 시각. 링크/동작 없음(감싸는 쪽이 소유).
export function ConfirmedSessionNotice({ confirmedAt }: { confirmedAt: Date }) {
  return (
    <StatusNotice tone="success">
      <Text typography="subtitle2" foreground="success" render={<div />}>
        세션 확정
      </Text>
      <Text typography="heading3" foreground="success" render={<div />} className="mt-0.5">
        {formatDateTime(confirmedAt)}
      </Text>
    </StatusNotice>
  );
}
