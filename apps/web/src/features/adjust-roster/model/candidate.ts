import type { ParticipantStatus } from "@/entities/game";

export type Candidate = {
  userId: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  status: ParticipantStatus | null;
  // 등록 4단계 찾기 결과만 채운다. 정지 중이면 직접 확정으로 고를 수 없다.
  sanctioned?: boolean;
};
