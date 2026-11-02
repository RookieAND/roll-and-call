import { Callout } from "@roll-and-call/ui";

import { SEATS_NOTICE, type SeatsNotice } from "./seats-notice";

const NOTICE = {
  [SEATS_NOTICE.full]: {
    palette: "warning",
    title: "남은 자리가 없습니다",
    description: "확정에서 한 명을 대기로 옮기거나 내보내면 추가할 수 있습니다.",
  },
  [SEATS_NOTICE.raisable]: {
    palette: "gray",
    title: "정원이 차 있습니다",
    description: "1명을 골라 정원을 늘려 넣을 수 있습니다.",
  },
  [SEATS_NOTICE.raised]: {
    palette: "warning",
    title: "이미 정원을 한 번 늘렸습니다",
    description: "불참으로 내보내면 자리가 납니다.",
  },
} as const;

interface SeatsFullNoticeProps {
  notice: SeatsNotice;
}

export function SeatsFullNotice({ notice }: SeatsFullNoticeProps) {
  const { palette, title, description } = NOTICE[notice];
  return (
    <Callout.Root colorPalette={palette} className="mx-250">
      <Callout.Icon />
      <Callout.Title>{title}</Callout.Title>
      <Callout.Description>{description}</Callout.Description>
    </Callout.Root>
  );
}
