import { Callout, Text, VStack } from "@roll-and-call/ui";

import { RULEBOOK_KIND_LABEL } from "@/entities/rulebook";
import type { RulebookRequestRow } from "@/entities/rulebook/server";
import {
  MobileRequestActions,
  REQUEST_ACTION,
  type RequestAction,
} from "@/features/process-rulebook-request";
import { formatDate } from "@/shared/lib";
import { AdminHeader, KeyValueList, ListRow, Tag } from "@/shared/ui";

import { RULEBOOKS_TAB } from "../../model/rulebooks-tab";

interface RequestDetailProps {
  request: RulebookRequestRow;
  actionHref: (action: RequestAction, requestId: string) => string;
}

// 데스크톱은 요청 줄의 메뉴에서 바로 처리한다. 모바일은 줄을 누르면 이 상세가 열리고 처리 버튼을 아래에 고정한다.
export function RequestDetail({ request, actionHref }: RequestDetailProps) {
  const requester =
    request.otherRequesterCount > 0
      ? `${request.requesterNickname} 외 ${request.otherRequesterCount}명`
      : request.requesterNickname;
  return (
    <>
      <AdminHeader
        title={request.name}
        trail={[{ href: `/rules?tab=${RULEBOOKS_TAB.requests}`, label: "추가 요청" }]}
      />
      <VStack gap="150" className="p-150 pb-200">
        <section className="rounded-600 border border-gray-200 bg-surface px-175">
          <KeyValueList
            items={[
              { label: "요청한 룰북", value: request.name },
              { label: "요청자", value: requester },
              {
                label: "요청일",
                value: `${formatDate(request.requestedAt)} · ${request.waitedDays}일째`,
              },
              { label: "카테고리", value: request.category ?? "—" },
              {
                label: "종류",
                value: <Tag>{request.kind ? RULEBOOK_KIND_LABEL[request.kind] : "잘 모름"}</Tag>,
              },
              {
                label: "요청 메모",
                value: request.games ? "구인에서 직접 입력" : request.note || "—",
              },
            ]}
          />
        </section>
        {request.similarTo ? (
          <VStack
            gap="125"
            render={<section />}
            className="rounded-600 border border-gray-200 bg-surface px-175 py-150"
          >
            <Text typography="subtitle1" render={<h2 />}>
              비슷한 룰북
            </Text>
            <Callout.Root colorPalette="warning">
              <Callout.Title>이미 등록된 룰북과 이름이 겹칩니다</Callout.Title>
              <Callout.Description>
                새로 추가하기 전에 기존 룰북에 연결할 수 있는지 확인해 주세요.
              </Callout.Description>
            </Callout.Root>
            <Text
              typography="subtitle2"
              className="rounded-400 border border-gray-200 bg-(--rc-color-bg-canvas-raised) px-150 py-125"
            >
              {request.similarTo}
            </Text>
          </VStack>
        ) : null}
      </VStack>
      {request.games ? (
        <VStack render={<section />} aria-label="이 이름을 적은 구인">
          <Text typography="body3" weight="bold" className="px-200 pb-075">
            이 이름을 적은 구인
          </Text>
          {request.games.map((game) => (
            <ListRow
              key={game.id}
              path={`/posts/${game.id}`}
              title={game.title}
              description={`GM ${game.gmNickname}`}
            />
          ))}
        </VStack>
      ) : null}
      <MobileRequestActions
        similar={Boolean(request.similarTo)}
        actionHrefs={{
          [REQUEST_ACTION.add]: actionHref(REQUEST_ACTION.add, request.id),
          [REQUEST_ACTION.link]: actionHref(REQUEST_ACTION.link, request.id),
          [REQUEST_ACTION.reject]: actionHref(REQUEST_ACTION.reject, request.id),
        }}
      />
    </>
  );
}
