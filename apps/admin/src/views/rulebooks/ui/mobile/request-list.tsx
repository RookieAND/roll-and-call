import { VStack } from "@roll-and-call/ui";

import type { RulebookRequestRow } from "@/entities/rulebook/server";
import { EMPTY_IMAGE, EmptyState, ListRow, Tag } from "@/shared/ui";

import { groupRulebookRequests } from "../../model/group-rulebook-requests";
import { RequestRow } from "./request-row";

interface RequestListProps {
  requests: RulebookRequestRow[];
}

export function RequestList({ requests }: RequestListProps) {
  if (requests.length === 0) {
    return (
      <EmptyState
        image={EMPTY_IMAGE.hosted}
        title="대기 중인 요청이 없습니다"
        description="사용자가 카탈로그에 없는 룰북을 요청하면 이곳에 표시됩니다."
      />
    );
  }
  return (
    <VStack>
      {groupRulebookRequests(requests).map((books) => {
        const request = books[0]!;
        return request.groupId && request.groupTotal > 1 ? (
          <ListRow
            key={request.groupId}
            path={`/rules?tab=requests&group=${request.groupId}`}
            title={`${request.requesterNickname}님의 룰북 ${request.groupTotal}권`}
            badges={<Tag>묶음 요청</Tag>}
            description={`대기 ${books.length}권 · 완료 ${request.groupCompleted}권`}
            meta={books.map((book) => book.name).join(", ")}
          />
        ) : (
          <RequestRow key={request.id} request={request} />
        );
      })}
    </VStack>
  );
}
