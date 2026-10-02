import "server-only";
import { rulebookLabel } from "@roll-and-call/database/rulebooks";

import { loadSnapshot } from "./snapshot";

export interface RulebookOption {
  id: string;
  label: string;
  free: boolean;
}

// 서버 설정의 무료 배포 룰 목록과 [룰 추가] 검색에 쓴다. 무료 배포 = 이 서버 룰북의 cert_required = false.
export async function listRulebookOptions(): Promise<RulebookOption[]> {
  const db = await loadSnapshot();
  return db.rulebooks
    .filter((rulebook) => !rulebook.hidden)
    .map((rulebook) => ({
      id: rulebook.id,
      label: rulebookLabel(rulebook),
      free: !rulebook.certRequired,
    }));
}
