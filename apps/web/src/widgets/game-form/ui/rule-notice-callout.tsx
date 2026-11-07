import { Callout } from "@roll-and-call/ui";

import { RULE_NOTICE, type RuleNotice } from "@/features/reopen-game";
import { topicParticle } from "@/shared/lib";
import { LineBreaks } from "@/shared/ui";

interface RuleNoticeCalloutProps {
  notice: RuleNotice;
}

export function RuleNoticeCallout({ notice }: RuleNoticeCalloutProps) {
  if (notice.kind === RULE_NOTICE.homebrewUnavailable) {
    return (
      <Callout.Root colorPalette="primary">
        <Callout.Description className="break-keep">
          <LineBreaks
            lines={["이 룰은 지금 사용할 수 없어 다시 고를 수 없습니다.", "다른 룰을 골라 주세요."]}
          />
        </Callout.Description>
      </Callout.Root>
    );
  }
  const isBlocked = notice.kind === RULE_NOTICE.blocked;
  return (
    <Callout.Root colorPalette="warning" className="p-150">
      <Callout.Icon />
      <Callout.Title>
        {isBlocked
          ? `${notice.label}${topicParticle(notice.label)} 인증이 필요해 비워 두었습니다.`
          : "이전 구인의 룰을 찾을 수 없습니다."}
      </Callout.Title>
      <Callout.Description>
        {isBlocked
          ? "다른 룰을 고르거나 룰북을 인증한 뒤 다시 열어 주세요."
          : "룰을 다시 골라 주세요."}
      </Callout.Description>
    </Callout.Root>
  );
}
