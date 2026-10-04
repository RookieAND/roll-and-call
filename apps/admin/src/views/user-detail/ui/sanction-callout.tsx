import { Callout } from "@roll-and-call/ui";

import { formatDate, formatDateTime } from "@/shared/lib";
import type { Sanction } from "@/shared/server";

import { PastSanctionsLink } from "./past-sanctions-link";

interface SanctionCalloutProps {
  sanction: Sanction;
  nickname: string;
  pastSanctionCount: number;
}

// 제재 중이라는 사실은 상태 카드 맨 위 이 안내 한 곳에서만 알린다(D294).
export function SanctionCallout({ sanction, nickname, pastSanctionCount }: SanctionCalloutProps) {
  const title = sanction.until
    ? `${formatDateTime(sanction.until)}까지 제재 중입니다`
    : "해제될 때까지 제재 중입니다";
  return (
    <Callout.Root colorPalette="danger">
      <Callout.Icon />
      <Callout.Title>{title}</Callout.Title>
      <Callout.Description>
        {`사유: ${sanction.reason} (${sanction.by}, ${formatDate(sanction.at)})`}
      </Callout.Description>
      {pastSanctionCount > 0 ? (
        <Callout.Action>
          <PastSanctionsLink nickname={nickname} count={pastSanctionCount} />
        </Callout.Action>
      ) : null}
    </Callout.Root>
  );
}
