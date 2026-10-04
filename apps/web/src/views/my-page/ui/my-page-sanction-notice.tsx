import { Callout } from "@roll-and-call/ui";

import { LineBreaks } from "@/shared/ui";

import { sanctionNoticeLines } from "../model/sanction-notice-lines";

interface MyPageSanctionNoticeProps {
  reason: string;
  until: Date | null;
}

export function MyPageSanctionNotice({ reason, until }: MyPageSanctionNoticeProps) {
  return (
    <Callout.Root colorPalette="danger">
      <Callout.Icon />
      <Callout.Title>활동이 정지된 상태입니다</Callout.Title>
      <Callout.Description>
        <LineBreaks lines={sanctionNoticeLines({ reason, until })} />
      </Callout.Description>
    </Callout.Root>
  );
}
