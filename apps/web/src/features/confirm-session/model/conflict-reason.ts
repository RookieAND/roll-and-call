import type { ScheduleConflictRejection } from "@/entities/game";

// 확정이 일정 겹침으로 막혔을 때 확인 창에 보일 사유 줄. GM 본인 겹침은 내 세션 제목, 참여자 겹침은 이름과 대기 여부를 보인다.
export function conflictReason({
  conflict,
  nicknames,
}: {
  conflict: Pick<ScheduleConflictRejection, "conflicts" | "gmOverlaps">;
  nicknames: Record<string, string | undefined>;
}): string[] {
  const gmLines = conflict.gmOverlaps.map(
    ({ gameTitle }) => `내 세션 「${gameTitle}」과 시간이 겹칩니다.`,
  );
  const people = conflict.conflicts
    .filter((entry) => entry.role !== "gm")
    .map((entry) => {
      const name = `${nicknames[entry.userId] ?? "참여자"}님`;
      return entry.role === "waiting" ? `${name}(대기)` : name;
    });
  const peopleLine =
    people.length > 0 ? [`${people.join(", ")}에게 이 시간에 다른 세션이 있습니다.`] : [];
  return [...gmLines, ...peopleLine];
}
