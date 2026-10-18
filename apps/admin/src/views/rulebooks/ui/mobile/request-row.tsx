import { RULEBOOK_KIND } from "@roll-and-call/database/rulebooks/model";
import { Text } from "@roll-and-call/ui";

import { RULEBOOK_KIND_LABEL } from "@/entities/rulebook";
import type { RulebookRequestRow } from "@/entities/rulebook/server";
import { formatFullDate, withQuery } from "@/shared/lib";
import { ListRow, Tag } from "@/shared/ui";

import { RULEBOOKS_TAB } from "../../model/rulebooks-tab";

const LONG_WAIT_DAYS = 5;

interface RequestRowProps {
  request: RulebookRequestRow;
}

export function RequestRow({ request }: RequestRowProps) {
  const longWait = request.waitedDays >= LONG_WAIT_DAYS;
  const requester =
    request.otherRequesterCount > 0
      ? `${request.requesterNickname} 외 ${request.otherRequesterCount}명`
      : request.requesterNickname;
  const meta = request.games
    ? `구인에서 직접 입력 · 구인 ${request.games.length}건`
    : (request.category ?? null);
  const kindBadge =
    request.kind && request.kind !== RULEBOOK_KIND.core ? (
      <Tag>{RULEBOOK_KIND_LABEL[request.kind]}</Tag>
    ) : null;
  return (
    <ListRow
      path={withQuery("/rules", { tab: RULEBOOKS_TAB.requests }, { request: request.id })}
      title={request.name}
      badges={
        kindBadge || request.similarTo ? (
          <>
            {kindBadge}
            {request.similarTo ? <Tag tone="warning">비슷한 룰북 있음</Tag> : null}
          </>
        ) : null
      }
      trailing={
        <Text
          typography="body3"
          weight={longWait ? "bold" : undefined}
          foreground={longWait ? "danger" : "muted"}
        >
          {request.waitedDays}일째
        </Text>
      }
      description={`${requester} · ${formatFullDate(request.requestedAt)}`}
      meta={meta}
    />
  );
}
