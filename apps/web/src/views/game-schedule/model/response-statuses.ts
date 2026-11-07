import { uniq } from "es-toolkit";

export type ScheduleMember = { name: string; isGm: boolean };

// 가능 시간을 한 칸이라도 낸 사람은 「냄」이다. 겹침 집계가 이름만 들고 있어 이름으로 맞춘다.
export function responseStatuses({
  members,
  names,
}: {
  members: ScheduleMember[];
  names: Record<string, string[]>;
}): (ScheduleMember & { responded: boolean })[] {
  const respondents = new Set(uniq(Object.values(names).flat()));
  return members.map((member) => ({ ...member, responded: respondents.has(member.name) }));
}
