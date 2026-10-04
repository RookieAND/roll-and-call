import type { GrantOptions } from "@/shared/server";

const RESULT_LIMIT = 20;

// 닉네임·디스코드 핸들·디스코드 ID를 대소문자 없이 부분 일치로 찾는다. 고른 사람은 목록 위에 따로 보이므로 뺀다.
export function searchGrantMembers({
  members,
  query,
  excludeIds,
}: {
  members: GrantOptions["members"];
  query: string;
  excludeIds: readonly string[];
}) {
  const keyword = query.trim().toLowerCase();
  if (!keyword) return [];
  return members
    .filter(
      (member) =>
        !excludeIds.includes(member.id) &&
        [member.nickname, member.discordHandle, member.discordId].some((value) =>
          value.toLowerCase().includes(keyword),
        ),
    )
    .slice(0, RESULT_LIMIT);
}
