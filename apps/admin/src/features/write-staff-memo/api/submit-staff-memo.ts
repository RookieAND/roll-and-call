import { saveStaffMemo } from "./save-staff-memo";
import { updateStaffMemo } from "./update-staff-memo";

// 메모 창 하나가 추가와 고치기를 함께 한다. memo가 있으면 고치기다.
export function submitStaffMemo({
  userId,
  memo,
  body,
}: {
  userId: string;
  memo?: { id: string };
  body: string;
}) {
  return memo ? updateStaffMemo({ memoId: memo.id, body }) : saveStaffMemo({ userId, body });
}
