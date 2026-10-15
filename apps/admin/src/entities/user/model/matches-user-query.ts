import type { UserRow } from "./user-row";

// 그 서버 닉네임(운영진이 바꾸기 전 닉네임 포함)과 디스코드 ID를 대소문자 없이 부분 일치로 찾는다.
export function matchesUserQuery({ row, query }: { row: UserRow; query?: string }) {
  const keyword = query?.trim().toLowerCase();
  if (!keyword) return true;
  return [row.nickname, ...row.previousNicknames, row.discordHandle, row.discordId].some((value) =>
    value.toLowerCase().includes(keyword),
  );
}
