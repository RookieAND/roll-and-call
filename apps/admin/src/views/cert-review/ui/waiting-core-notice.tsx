import { objectParticle } from "@roll-and-call/database/notifications/model";
import { Button, Callout, HStack } from "@roll-and-call/ui";

import { NextItemButton, ServerLink } from "@/shared/ui";

interface WaitingCoreNoticeProps {
  coreLabel: string;
  coreHref: string;
  nextHref?: string;
}

export function WaitingCoreNotice({ coreLabel, coreHref, nextHref }: WaitingCoreNoticeProps) {
  return (
    <HStack align="center" gap="125">
      <Callout.Root colorPalette="primary" className="min-w-0 flex-1">
        <Callout.Icon />
        <Callout.Title>기본 룰북 심사가 먼저 필요합니다</Callout.Title>
        <Callout.Description>{`${coreLabel}${objectParticle(coreLabel)} 먼저 심사해야 이 서플리먼트를 처리할 수 있습니다.`}</Callout.Description>
      </Callout.Root>
      <Button render={<ServerLink path={coreHref} />}>그 신청 열기</Button>
      <NextItemButton href={nextHref} />
    </HStack>
  );
}
