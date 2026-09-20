import { windowMembers } from "./window-members";

export type SessionWindow = { iso: string; members: string[] };

// 가능 인원 내림차순, 동률이면 이른 시각.
export function rankWindows({
  names,
  slotCount,
  limit,
}: {
  names: Record<string, string[]>;
  slotCount: number;
  limit: number;
}): SessionWindow[] {
  return Object.keys(names)
    .map((iso) => ({ iso, members: windowMembers({ names, startIso: iso, slotCount }) }))
    .filter((window) => window.members.length > 0)
    .toSorted(
      (left, right) =>
        right.members.length - left.members.length || left.iso.localeCompare(right.iso),
    )
    .slice(0, limit);
}
