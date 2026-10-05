import { isNil } from "es-toolkit";

import type { ChosenReason } from "./chosen-reason";
import { OTHER_REASON_CODE } from "./other-reason-code";
import { REASON_TEXT_MAX_LENGTH } from "./reason-text-max-length";

// 서버 액션이 받은 사유를 확인한다. 코드는 목록에 있어야 하고, 기타면 글이 1~100자여야 한다. 기타가 아니면 글을 버린다.
// 창은 이런 사유로 확정을 막으므로 여기서 던지면 잘못된 요청이다.
export function parseReason({
  reason,
  reasons,
}: {
  reason: { code: string | null; text: string | null } | null;
  reasons: Readonly<Record<string, string>>;
}): ChosenReason {
  const code = reason?.code;
  if (isNil(code) || !Object.hasOwn(reasons, code)) throw new Error("사유를 골라 주세요");
  if (code !== OTHER_REASON_CODE) return { code, text: null };
  const text = reason?.text?.trim();
  if (!text) throw new Error("기타 사유를 적어 주세요");
  if (text.length > REASON_TEXT_MAX_LENGTH) {
    throw new Error(`사유는 ${REASON_TEXT_MAX_LENGTH}자까지 적을 수 있습니다`);
  }
  return { code, text };
}
