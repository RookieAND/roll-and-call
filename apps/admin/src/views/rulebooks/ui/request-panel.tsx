import { Badge, Text, VStack } from "@roll-and-call/ui";
import { FileText } from "lucide-react";

import { RequestActions, type RequestAction } from "@/features/process-rulebook-request";
import { RULEBOOK_KIND_LABEL } from "@/shared/lib";
import type { RulebookRequestRow } from "@/shared/server";
import { ItemCard, Panel } from "@/shared/ui";

interface RequestPanelProps {
  requests: RulebookRequestRow[];
  actionHref: (action: RequestAction, requestId: string) => string;
}

export function RequestPanel({ requests, actionHref }: RequestPanelProps) {
  const countPalette = requests.length > 0 ? "primary" : "gray";
  return (
    <Panel
      title="룰북 추가 요청"
      right={<Badge colorPalette={countPalette}>{requests.length}건</Badge>}
      bodyClassName="p-150"
    >
      {requests.length === 0 ? (
        <Text typography="body4" foreground="hint">
          대기 중인 요청이 없습니다.
        </Text>
      ) : (
        <VStack gap="100">
          {requests.map((request) => (
            <ItemCard
              key={request.id}
              icon={FileText}
              tone="primary"
              title={request.name}
              meta={[
                `${request.requesterNickname} 요청`,
                request.kind ? RULEBOOK_KIND_LABEL[request.kind] : null,
                request.category,
              ]
                .filter(Boolean)
                .join(" · ")}
              right={<RequestActions actionHref={(action) => actionHref(action, request.id)} />}
            >
              {request.note || request.similarTo ? (
                <>
                  {request.note ? <div>{request.note}</div> : null}
                  {request.similarTo ? (
                    <Text typography="body3" foreground="hint" render={<div />}>
                      비슷한 룰북{" "}
                      <Text typography="body3" weight="bold" foreground="normal" render={<b />}>
                        {request.similarTo}
                      </Text>
                    </Text>
                  ) : null}
                </>
              ) : null}
            </ItemCard>
          ))}
        </VStack>
      )}
    </Panel>
  );
}
