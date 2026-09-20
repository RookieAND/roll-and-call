import { SLOT_MINUTES } from "@/shared/lib";

const MINUTE_MS = 60_000;

// 시작 칸부터 플레이타임 끝까지 연속으로 낸 사람만 그 시간에 세션을 할 수 있다.
export function windowMembers({
  names,
  startIso,
  slotCount,
}: {
  names: Record<string, string[]>;
  startIso: string;
  slotCount: number;
}): string[] {
  const start = new Date(startIso).getTime();
  if (Number.isNaN(start)) return [];

  let members = names[new Date(start).toISOString()] ?? [];
  for (let step = 1; step < slotCount && members.length > 0; step++) {
    const nextIso = new Date(start + step * SLOT_MINUTES * MINUTE_MS).toISOString();
    const next = new Set(names[nextIso] ?? []);
    members = members.filter((name) => next.has(name));
  }
  return members;
}
