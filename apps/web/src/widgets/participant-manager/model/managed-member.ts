import type { MemberSummary } from "@/features/manage-participants";

// 관리 화면이 한 줄에 그리는 참여자. 동작에 필요한 정보(MemberSummary)에
// 이 화면에서만 쓰는 표시값(대기 순번·가능 시간 입력 여부)을 더한다.
export type ManagedMember = MemberSummary & {
  waitlistRank: number | null;
  hasAvailability: boolean;
};
