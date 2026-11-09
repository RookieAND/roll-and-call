import { Button, HStack, Text, VStack, cn } from "@roll-and-call/ui";

import { RULEBOOK_KIND_LABEL } from "@/entities/rulebook";
import type { RulebookRequestRow } from "@/entities/rulebook/server";
import { REQUEST_ACTION, type RequestAction } from "@/features/process-rulebook-request";
import { formatFullDate, withQuery } from "@/shared/lib";
import { FactRows, Panel, ServerLink, Tag } from "@/shared/ui";

import { reviewRequest } from "../model/group-rulebook-requests";

const STATUS = { added: "추가 완료", linked: "연결 완료", rejected: "반려" } as const;

interface RequestGroupPanelProps {
  requests: RulebookRequestRow[];
  selectedId?: string;
  actionHref: (action: RequestAction, requestId: string) => string;
}

export function RequestGroupPanel({ requests, selectedId, actionHref }: RequestGroupPanelProps) {
  const selected = reviewRequest(requests, selectedId);
  if (!selected) return null;
  const completed = requests.filter((request) => request.processed).length;
  const next = requests.find((request) => !request.processed && request.id !== selected.id);
  return (
    <VStack gap="150">
      <ServerLink path="/rules?tab=requests" className="text-body3 text-muted underline">
        추가 요청 목록으로
      </ServerLink>
      <Panel title={`${selected.requesterNickname}님의 묶음 요청`} bodyClassName="p-175">
        <VStack gap="075">
          <Text typography="subtitle2">
            전체 {requests.length}권 · 처리 완료 {completed}권 · 대기 {requests.length - completed}
            권
          </Text>
          <Text typography="body3" foreground="muted">
            책마다 내용을 확인하고 추가, 기존 룰북 연결 또는 반려로 처리합니다.
          </Text>
        </VStack>
      </Panel>
      <div className="grid items-start gap-150 lg:grid-cols-[280px_minmax(0,1fr)]">
        <Panel title="함께 요청한 룰북">
          <nav aria-label="함께 요청한 룰북">
            {requests.map((request, index) => (
              <ServerLink
                key={request.id}
                path={withQuery(
                  "/rules",
                  { tab: "requests", group: request.groupId },
                  { request: request.id },
                )}
                aria-current={selected.id === request.id ? "true" : undefined}
                className={cn(
                  "flex items-center justify-between gap-100 border-b border-gray-100 px-175 py-150 last:border-b-0",
                  selected.id === request.id && "bg-gray-100",
                )}
              >
                <Text
                  typography="body3"
                  weight={selected.id === request.id ? "bold" : undefined}
                  className="min-w-0 break-words"
                >
                  {index + 1}. {request.name}
                </Text>
                <Tag>{request.outcome ? STATUS[request.outcome] : "대기"}</Tag>
              </ServerLink>
            ))}
          </nav>
        </Panel>
        <Panel title={selected.name} bodyClassName="p-175">
          <VStack gap="150">
            <FactRows
              items={[
                { label: "요청일", value: formatFullDate(selected.requestedAt) },
                { label: "카테고리", value: selected.category || "—" },
                { label: "판본", value: selected.edition || "—" },
                {
                  label: "종류",
                  value: selected.kind ? RULEBOOK_KIND_LABEL[selected.kind] : "잘 모름",
                },
                { label: "요청 메모", value: selected.note || "—" },
                ...(selected.similarTo
                  ? [{ label: "비슷한 룰북", value: selected.similarTo }]
                  : []),
                ...(selected.processed
                  ? [
                      {
                        label: "처리 결과",
                        value: selected.outcome ? STATUS[selected.outcome] : "처리 완료",
                      },
                      { label: "처리자", value: selected.processed.by },
                      { label: "처리일", value: formatFullDate(selected.processed.at) },
                      ...(selected.rejectReason
                        ? [{ label: "반려 사유", value: selected.rejectReason }]
                        : []),
                    ]
                  : []),
              ]}
            />
            {!selected.processed ? (
              <HStack gap="100" className="flex-wrap">
                <Button render={<ServerLink path={actionHref(REQUEST_ACTION.add, selected.id)} />}>
                  새 룰북 추가
                </Button>
                <Button
                  variant="outline"
                  render={<ServerLink path={actionHref(REQUEST_ACTION.link, selected.id)} />}
                >
                  기존 룰북에 연결
                </Button>
                <Button
                  variant="outline"
                  colorPalette="danger"
                  render={<ServerLink path={actionHref(REQUEST_ACTION.reject, selected.id)} />}
                >
                  반려
                </Button>
              </HStack>
            ) : null}
            {next ? (
              <ServerLink
                path={withQuery(
                  "/rules",
                  { tab: "requests", group: selected.groupId },
                  { request: next.id },
                )}
                className="text-body3 underline"
              >
                다음 미처리 룰북 보기
              </ServerLink>
            ) : null}
            {completed === requests.length ? (
              <Text typography="body3" foreground="muted">
                이 묶음의 모든 요청을 처리했습니다.
              </Text>
            ) : null}
          </VStack>
        </Panel>
      </div>
    </VStack>
  );
}
