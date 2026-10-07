import { Callout } from "@roll-and-call/ui";

import { formatDateTime } from "@/shared/lib";

interface ConfirmedSessionNoticeProps {
  confirmedAt: Date;
}

export function ConfirmedSessionNotice({ confirmedAt }: ConfirmedSessionNoticeProps) {
  return (
    <Callout.Root colorPalette="success">
      <Callout.Icon />
      <Callout.Title>세션 확정 · {formatDateTime(confirmedAt)}</Callout.Title>
      <Callout.Description>확정 칸은 초록 테두리입니다. 입력은 잠깁니다.</Callout.Description>
    </Callout.Root>
  );
}
