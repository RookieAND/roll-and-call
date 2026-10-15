import type { PostDetail } from "@/entities/post/server";

type Member = PostDetail["members"][number] | PostDetail["waitlist"][number];

// 모바일 줄 오른쪽의 상태 문구. 「확정 · GM」처럼 ` · `로 이으면 뱃지 둘이다.
export function memberStatus({ member, gmId }: { member: Member; gmId: string }) {
  if ("listOrder" in member) return `대기 ${member.listOrder}번`;
  if (member.userId === gmId) return "확정 · GM";
  return "확정";
}
