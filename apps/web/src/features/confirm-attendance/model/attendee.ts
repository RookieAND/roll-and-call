export type Attendee = {
  userId: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  absent: boolean;
  // 세션 중 불참으로 내보낸 사람(removed). 참석으로 확정하면 확정 참여자로 돌아온다.
  removed: boolean;
  absenceReason: string | null;
  // 운영진이 취소한 불참은 GM이 다시 골라도 취소로 남는다.
  staffCancelled: boolean;
  // 운영진이 추가한 불참은 GM이 바꿀 수 없다.
  staffAdded: boolean;
};
