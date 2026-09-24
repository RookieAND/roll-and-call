import { Badge, Text, VStack } from "@roll-and-call/ui";
import { FileText } from "lucide-react";

import {
  REQUEST_ACTION,
  RequestActions,
  type RequestAction,
} from "@/features/process-rulebook-request";
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
              meta={`${request.requesterNickname} 요청`}
              right={
                <RequestActions
                  request={request}
                  linkHref={actionHref(REQUEST_ACTION.link, request.id)}
                  rejectHref={actionHref(REQUEST_ACTION.reject, request.id)}
                />
              }
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
