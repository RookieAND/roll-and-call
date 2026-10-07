import type { ManagedMember } from "./managed-member";

// 확정 목록 한 줄의 보조 글. 세션 시작 뒤에는 짧게 「제출함」·「미제출」, 불참으로 내보낸 사람은 「내보냄」.
export function confirmedRowNote({
  member,
  isCoordinate,
  started,
}: {
  member: ManagedMember;
  isCoordinate: boolean;
  started: boolean;
}): { text?: string; foreground: "muted" | "hint" | "warning" } {
  if (member.removed) return { text: "내보냄", foreground: "hint" };
  if (!isCoordinate) return { foreground: "muted" };
  if (started) return { text: member.hasAvailability ? "제출함" : "미제출", foreground: "hint" };
  return member.hasAvailability
    ? { text: "가능 시간 제출", foreground: "muted" }
    : { text: "가능 시간 미제출", foreground: "warning" };
}
