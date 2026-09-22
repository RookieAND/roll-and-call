import { Text } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { formatDateTime } from "@/shared/lib";
import { StatusNotice } from "@/shared/ui";
interface ConfirmedSessionNoticeProps {
  confirmedAt: Date;
  note?: ReactNode;
}

export function ConfirmedSessionNotice({ confirmedAt, note }: ConfirmedSessionNoticeProps) {
  return (
    <StatusNotice tone="success">
      <Text typography="body4" weight="bold" foreground="success" render={<div />}>
        세션 확정
      </Text>
      <Text
        typography="heading3"
        weight="extrabold"
        foreground="successStrong"
        render={<div />}
        className="mt-050"
      >
        {formatDateTime(confirmedAt)}
      </Text>
      {note && (
        <Text typography="body4" foreground="success" render={<p />} className="mt-075">
          {note}
        </Text>
      )}
    </StatusNotice>
  );
}
