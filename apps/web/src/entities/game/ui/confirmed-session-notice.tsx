import { Text } from "@trpg/ui";

import { formatDateTime } from "@/shared/lib";
import { StatusNotice } from "@/shared/ui";
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
