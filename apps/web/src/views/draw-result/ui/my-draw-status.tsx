import { Callout } from "@roll-and-call/ui";
import { Check, Clock } from "lucide-react";

interface MyDrawStatusProps {
  confirmed: boolean;
  waitlistRank: number | null;
}

export function MyDrawStatus({ confirmed, waitlistRank }: MyDrawStatusProps) {
  if (confirmed) {
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
      <Callout.Title>아쉽지만 추첨 결과 대기 {waitlistRank}번이에요</Callout.Title>
    </Callout.Root>
  );
}
