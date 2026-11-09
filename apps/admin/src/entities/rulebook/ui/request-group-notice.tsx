import { Text, VStack } from "@roll-and-call/ui";

import { ServerLink } from "@/shared/ui";

import type { RulebookRequestRow } from "../api/list-rulebook-requests";

export function RequestGroupNotice({ request }: { request: RulebookRequestRow }) {
  if (!request.groupId || request.groupTotal < 2) return null;
  return (
    <VStack gap="050" className="rounded-400 border border-gray-200 p-150">
      <Text typography="body3" weight="bold">
        함께 요청한 {request.groupTotal}권 중 {request.groupCompleted}권 처리 완료
      </Text>
      <Text typography="body4" foreground="muted">
        {request.groupTotal - request.groupCompleted > 1
          ? "현재 책만 처리하며, 완료 후 같은 묶음의 다음 대기 책으로 이동합니다."
          : "현재 책을 처리하면 이 묶음의 검토가 완료됩니다."}
      </Text>
      <ServerLink
        path={`/rules?tab=requests&group=${request.groupId}`}
        className="text-body3 underline"
      >
        묶음 요청 보기
      </ServerLink>
    </VStack>
  );
}
