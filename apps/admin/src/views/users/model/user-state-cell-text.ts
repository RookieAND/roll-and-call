import { formatDate, MEMBERSHIP_LABEL, MEMBERSHIP_STATUS } from "@/shared/lib";
import type { UserRow } from "@/shared/server";

type UserStateSource = Pick<UserRow, "membership" | "sanctioned" | "sanctionUntil">;

// 제재 중일 때만 뱃지와 끝나는 날을 보이고, 그 밖은 회색 글자 하나다.
export function userStateCellText(row: UserStateSource) {
  if (row.sanctioned) {
    const period = row.sanctionUntil ? `${formatDate(row.sanctionUntil)}까지` : "해제될 때까지";
    return { badge: "제재 중", text: period };
  }
  const text =
    row.membership === MEMBERSHIP_STATUS.active ? "정상" : MEMBERSHIP_LABEL[row.membership];
  return { badge: null, text };
}
