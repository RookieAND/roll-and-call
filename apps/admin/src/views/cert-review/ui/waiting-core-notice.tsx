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
      <Callout.Root colorPalette="warning" className="min-w-0 flex-1">
        <Callout.Icon />
        <Callout.Description>{`${coreLabel}${objectParticle(coreLabel)} 먼저 심사해야 합니다.`}</Callout.Description>
      </Callout.Root>
      <Button size="sm" render={<ServerLink path={coreHref} />}>
        그 신청 열기
      </Button>
      <NextItemButton href={nextHref} />
    </HStack>
  );
}
