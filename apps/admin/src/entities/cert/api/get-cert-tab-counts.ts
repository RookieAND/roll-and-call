import "server-only";
import { getPendingItems } from "@/shared/server";

import type { CertTabCountKey } from "../model/cert-tabs";

// 사이드바 건수와 같은 처리 대기 조회를 읽는다.
export async function getCertTabCounts(): Promise<Record<CertTabCountKey, number>> {
  const items = await getPendingItems();
  const countOf = (kind: CertTabCountKey) => items.find((item) => item.kind === kind)?.count ?? 0;
  return { cert: countOf("cert"), homebrew: countOf("homebrew") };
}
