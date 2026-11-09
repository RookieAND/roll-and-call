import { Text, VStack } from "@roll-and-call/ui";

import type { RulebookRequestRow } from "@/entities/rulebook/server";
import { withQuery } from "@/shared/lib";

import { RequestList } from "./mobile/request-list";
import { RequestGroupPanel } from "./request-group-panel";
import { RequestPanel } from "./request-panel";

const books: RulebookRequestRow[] = [
  "탐사자 핸드북",
  "수호자 룰북",
  "크툴루 나우",
  "펄프 크툴루",
].map((name, index) => ({
  id: `preview-${index}`,
  groupId: "preview-group",
  name,
  bookName: name,
  edition: "7판",
  kind: "supplement",
  category: "크툴루의 부름",
  note: "한국어판 추가를 요청합니다.",
  requesterNickname: "탐사자",
  requestedAt: new Date("2026-11-09T12:00:00Z"),
  waitedDays: 1,
  games: null,
  otherRequesterCount: 0,
  groupTotal: 4,
  groupCompleted: 2,
  outcome: (["added", "rejected", null, null] as const)[index] ?? null,
  rejectReason: index === 1 ? "이미 등록된 룰북입니다." : null,
  processed: index < 2 ? { by: "운영진", at: new Date("2026-11-10T03:00:00Z") } : undefined,
}));

export function RulebookRequestsPreview({ selectedId }: { selectedId?: string }) {
  const pending = books.filter((book) => !book.processed);
  const actionHref = (action: string, request: string) =>
    withQuery("/dev/rulebook-requests", {}, { action, request });
  return (
    <VStack gap="200" className="mx-auto max-w-[1400px] p-200">
      <Text typography="heading2" render={<h1 />}>
        룰북 묶음 요청 운영진 시안
      </Text>
      <Text typography="body3" foreground="muted">
        예시 데이터입니다. 실제 요청을 처리하지 않습니다.
      </Text>
      <div className="max-lg:hidden">
        <RequestPanel requests={pending} actionHref={actionHref} />
      </div>
      <div className="lg:hidden">
        <RequestList requests={pending} />
      </div>
      <RequestGroupPanel requests={books} selectedId={selectedId} actionHref={actionHref} />
    </VStack>
  );
}
