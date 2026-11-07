import { HOMEBREW_LIMIT } from "@roll-and-call/database/homebrew/model";

import { OTHER_REASON } from "@/shared/lib";

interface RejectFormStateOptions {
  reason: string | null;
  message: string;
}

// 글자 수는 코드 포인트로 센다. 「기타」는 문구가 있어야 반려할 수 있다.
export function rejectFormState({ reason, message }: RejectFormStateOptions) {
  const length = Array.from(message).length;
  const other = reason === OTHER_REASON;
  const blank = message.trim().length === 0;
  return {
    length,
    other,
    full: length >= HOMEBREW_LIMIT.rejectReasonLength,
    otherBlank: other && blank,
    canSubmit: Boolean(reason) && !(other && blank),
  };
}
