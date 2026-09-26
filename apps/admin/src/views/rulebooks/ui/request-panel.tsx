import { Badge, Table, Text, VStack } from "@roll-and-call/ui";

import { RequestActions, type RequestAction } from "@/features/process-rulebook-request";
import type { RulebookRequestRow } from "@/shared/server";
import { Panel, TableColumns } from "@/shared/ui";

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
      bodyClassName={requests.length === 0 ? "p-150" : undefined}
    >
      {requests.length === 0 ? (
        <Text typography="body4" foreground="hint">
          대기 중인 요청이 없습니다.
        </Text>
      ) : (
        <Table.Root className="table-equal">
          <TableColumns widths={[320, 120, 260, { fixed: 220 }]} />
          <Table.Header>
            <Table.Row>
              <Table.Head>요청한 룰북</Table.Head>
              <Table.Head>요청자</Table.Head>
              <Table.Head>요청 메모</Table.Head>
              <Table.Head />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {requests.map((request) => (
              <Table.Row key={request.id}>
                <Table.Cell>
                  <VStack gap="025" className="min-w-0">
                    <Text typography="body3" weight="bold" className="break-keep">
                      {request.name}
                    </Text>
                    {request.similarTo && (
                      <Text typography="body4" foreground="hint" truncate>
                        비슷한 룰북: {request.similarTo}
                      </Text>
                    )}
                  </VStack>
                </Table.Cell>
                <Table.Cell>
                  <Text typography="body3" truncate>
                    {request.requesterNickname}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text typography="body3" foreground={request.note ? "normal" : "hint"}>
                    {request.note || "—"}
                  </Text>
                </Table.Cell>
                <Table.Cell align="end">
                  <RequestActions
                    similar={Boolean(request.similarTo)}
                    actionHref={(action) => actionHref(action, request.id)}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </Panel>
  );
}
