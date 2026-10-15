import { VStack } from "@roll-and-call/ui";

import type { RulebookRequestRow } from "@/entities/rulebook/server";
import { EMPTY_IMAGE, EmptyState } from "@/shared/ui";

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
      {requests.map((request) => (
        <RequestRow key={request.id} request={request} />
      ))}
    </VStack>
  );
}
