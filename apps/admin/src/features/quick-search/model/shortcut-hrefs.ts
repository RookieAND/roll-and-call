import { PENDING_COPY } from "@/shared/lib";
import type { PendingItem } from "@/shared/server";

// G 다음 글자로 가는 곳(D187). C는 가장 오래 기다린 인증 신청의 심사 상세, B는 추가 요청 탭, R은 후기 화면이다.
export function shortcutHrefs(pendingItems: PendingItem[]): Record<string, string> {
  const oldestCertId = pendingItems.find((item) => item.kind === "cert")?.oldestId ?? null;
  return {
    [PENDING_COPY.cert.shortcut]: PENDING_COPY.cert.href(oldestCertId),
    [PENDING_COPY.rulebookRequest.shortcut]: PENDING_COPY.rulebookRequest.href(),
    R: "/reviews",
  };
}
