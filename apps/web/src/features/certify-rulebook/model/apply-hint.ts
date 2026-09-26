import { CERT_FORMAT, CERT_FORMAT_LABEL } from "@/entities/rulebook";

import type { BookDraft } from "./book-draft";
import { draftMissing } from "./draft-missing";

// 신청 버튼 위 한 줄과 버튼을 켤지. 여러 권이면 모두 채워야 한다.
export function applyHint(drafts: BookDraft[]) {
  const missing = drafts.map(draftMissing);
  const ready = missing.every((line) => line === null);
  if (drafts.length === 1) return { ready, hint: missing[0] ?? "" };
  if (!ready) return { ready, hint: `${drafts.length}권 모두 채우면 신청할 수 있습니다` };
  const count = (format: string) => drafts.filter((draft) => draft.format === format).length;
  const hint = Object.values(CERT_FORMAT)
    .filter((format) => count(format) > 0)
    .map((format) => `${CERT_FORMAT_LABEL[format]} ${count(format)}권`)
    .join(" · ");
  return { ready, hint };
}
