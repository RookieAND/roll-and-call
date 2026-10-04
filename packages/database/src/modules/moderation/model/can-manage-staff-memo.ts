// 직접 쓴 운영진 메모는 쓴 사람과 서버 소유자(플랫폼 관리자 포함)만 고치거나 지운다(A03-07).
export function canManageStaffMemo({
  authorId,
  actorId,
  owner,
}: {
  authorId: string | null;
  actorId: string;
  owner: boolean;
}) {
  return owner || authorId === actorId;
}
