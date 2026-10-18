export function findUserNickname({
  users,
  userId,
}: {
  users: readonly { id: string; nickname: string }[];
  userId: string;
}): string {
  const user = users.find((candidate) => candidate.id === userId);
  if (!user) throw new Error(`스냅샷에 없는 유저입니다: ${userId}`);
  return user.nickname;
}
