import type { MemberSummary } from "@/features/adjust-roster";

// removed는 세션 시작 뒤 불참으로 내보낸 사람이다. 확정 목록에 남지만 정원·확정 수에는 세지 않는다.
export type ManagedMember = MemberSummary & { joinedAt: Date; removed: boolean };
