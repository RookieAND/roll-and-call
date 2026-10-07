import type { ManagedMember } from "./managed-member";

// 확정 목록 한 줄의 보조 글. 불참으로 내보낸 사람은 「내보냄」.
export function confirmedRowNote(member: ManagedMember): {
  text?: string;
  foreground: "muted" | "hint";
} {
  if (member.removed) return { text: "내보냄", foreground: "hint" };
  return { foreground: "muted" };
}
