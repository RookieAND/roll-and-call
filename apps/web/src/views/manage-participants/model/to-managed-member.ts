import type { RosterMember } from "@/entities/game";
import type { ManagedMember } from "./managed-member";

type ParticipantRow = RosterMember<{
  userId: string;
  user: { username: string; avatarUrl: string | null } | null;
}>;

// DB 조회 결과 한 줄을 관리 화면이 쓰는 모양으로 옮긴다.
// 가능 시간 입력 여부는 별도 조회(availableUserIds)에서 온다.
export function toManagedMember(
  participant: ParticipantRow,
  availableUserIds: Set<string>,
): ManagedMember {
  return {
    userId: participant.userId,
    username: participant.user?.username ?? "익명",
    avatarUrl: participant.user?.avatarUrl ?? null,
    applicationRank: participant.applicationRank,
    waitlistRank: participant.waitlistRank,
    hasAvailability: availableUserIds.has(participant.userId),
  };
}
