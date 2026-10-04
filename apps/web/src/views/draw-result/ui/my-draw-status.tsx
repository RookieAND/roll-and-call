import { Callout } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { Check, Clock } from "lucide-react";

interface MyDrawStatusProps {
  waitlistRank: number | null;
}

export function MyDrawStatus({ waitlistRank }: MyDrawStatusProps) {
  if (isNull(waitlistRank)) {
    return (
      <Callout.Root colorPalette="primary">
        <Callout.Icon>
          <Check size={14} strokeWidth={2.4} />
        </Callout.Icon>
        <Callout.Title>축하합니다. 참여가 확정되었습니다!</Callout.Title>
      </Callout.Root>
    );
  }

  return (
    <Callout.Root colorPalette="gray">
      <Callout.Icon>
        <Clock size={14} strokeWidth={2.2} />
      </Callout.Icon>
      <Callout.Title>아쉽지만 추첨 결과 대기 {waitlistRank}번입니다</Callout.Title>
      <Callout.Description>자리가 나면 GM이 대기 명단에서 확정합니다.</Callout.Description>
    </Callout.Root>
  );
}
