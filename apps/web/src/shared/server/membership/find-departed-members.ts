import { isUndefined } from "es-toolkit";

import { checkEachMember } from "./check-each-member";

export type DepartedMembers<Member> =
  | { skipped: false; checked: number; departed: Member[] }
  | { skipped: true; checked: number; departed: [] };

// 확인에 실패한 사람이 있으면 그 서버는 건너뛰어 아무도 탈퇴 처리하지 않는다.
export async function findDepartedMembers<Member>({
  members,
  isMember,
}: {
  members: Member[];
  isMember: (member: Member) => Promise<boolean>;
}): Promise<DepartedMembers<Member>> {
  const results = await checkEachMember({ members, check: isMember });
  if (isUndefined(results)) return { skipped: true, checked: 0, departed: [] };
  return {
    skipped: false,
    checked: members.length,
    departed: members.filter((_member, index) => results[index] === false),
  };
}
