import type { Snapshot } from "./snapshot";

export function findUserNickname({
  users,
  userId,
}: {
  users: Snapshot["users"];
  userId: string;
}): string {
  const user = users.find((candidate) => candidate.id === userId);
  if (!user) throw new Error(`스냅샷에 없는 유저입니다: ${userId}`);
  return user.nickname;
}
