import { Table, Text, VStack } from "@roll-and-call/ui";

import { RULEBOOK_KIND_LABEL } from "@/entities/rulebook";
import type { RulebookRequestRow } from "@/entities/rulebook/server";
import {
  REQUEST_ACTION,
  RequestActions,
  type RequestAction,
} from "@/features/process-rulebook-request";
import { formatFullDate } from "@/shared/lib";
import { EMPTY_IMAGE, EmptyState, Panel, SortFixedNote, TableColumns, Tag } from "@/shared/ui";

import { RequestGamesPopover } from "./request-games-popover";

interface RequestPanelProps {
  requests: RulebookRequestRow[];
  actionHref: (action: RequestAction, requestId: string) => string;
}

export function RequestPanel({ requests, actionHref }: RequestPanelProps) {
  if (requests.length === 0) {
    return (
      <Panel title="룰북 추가 요청">
        <div className="h-[300px]">
          <EmptyState
            image={EMPTY_IMAGE.hosted}
            title="대기 중인 요청이 없습니다"
            description="사용자가 카탈로그에 없는 룰북을 요청하면 이곳에 표시됩니다."
          />
        </div>
      </Panel>
    );
  }
  return (
    <Panel title="룰북 추가 요청" right={<SortFixedNote />}>
      <Table.Root className="table-equal">
        <TableColumns
          widths={[
            260,
            { fixed: 140 },
            { fixed: 116 },
            { fixed: 104 },
            { fixed: 96 },
            { fixed: 170 },
            { fixed: 220 },
          ]}
        />
        <Table.Header>
          <Table.Row>
            <Table.Head>요청한 룰북</Table.Head>
            <Table.Head>요청일</Table.Head>
            <Table.Head>카테고리</Table.Head>
            <Table.Head align="center">종류</Table.Head>
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
                  {request.similarTo ? (
                    <Text typography="body4" foreground="hint" truncate>
                      비슷한 룰북: {request.similarTo}
                    </Text>
                  ) : null}
                </VStack>
              </Table.Cell>
              <Table.Cell>
                <Text typography="body3" foreground="hint" numeric>
                  {`${formatFullDate(request.requestedAt)} · ${request.waitedDays}일째`}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Text typography="body3" truncate>
                  {request.category ?? "—"}
                </Text>
              </Table.Cell>
              <Table.Cell align="center">
                <Tag>{request.kind ? RULEBOOK_KIND_LABEL[request.kind] : "잘 모름"}</Tag>
              </Table.Cell>
              <Table.Cell>
                <Text typography="body3" truncate>
                  {request.otherRequesterCount > 0
                    ? `${request.requesterNickname} 외 ${request.otherRequesterCount}명`
                    : request.requesterNickname}
                </Text>
              </Table.Cell>
              <Table.Cell>
                {request.games ? (
                  <VStack align="start" gap="025">
                    <Text typography="body3">구인에서 직접 입력</Text>
                    <RequestGamesPopover games={request.games} />
                  </VStack>
                ) : (
                  <Text typography="body3" foreground={request.note ? "normal" : "hint"}>
                    {request.note || "—"}
                  </Text>
                )}
              </Table.Cell>
              <Table.Cell align="end">
                <RequestActions
                  label={request.name}
                  similar={Boolean(request.similarTo)}
                  actionHrefs={{
                    [REQUEST_ACTION.add]: actionHref(REQUEST_ACTION.add, request.id),
                    [REQUEST_ACTION.link]: actionHref(REQUEST_ACTION.link, request.id),
                    [REQUEST_ACTION.reject]: actionHref(REQUEST_ACTION.reject, request.id),
                  }}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Panel>
  );
}
