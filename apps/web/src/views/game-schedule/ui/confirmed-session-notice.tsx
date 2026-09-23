import { Callout } from "@roll-and-call/ui";

import { formatDateTime } from "@/shared/lib";

interface ConfirmedSessionNoticeProps {
  confirmedAt: Date;
  note?: string;
}

export function ConfirmedSessionNotice({ confirmedAt, note }: ConfirmedSessionNoticeProps) {
  const description = note
    ? `세션 확정 · ${formatDateTime(confirmedAt)}\n${note}`
    : `세션 확정 · ${formatDateTime(confirmedAt)}`;

  return (
    <Callout.Root colorPalette="success" size="sm">
      <Callout.Icon />
      <Callout.Description>{description}</Callout.Description>
    </Callout.Root>
  );
}
