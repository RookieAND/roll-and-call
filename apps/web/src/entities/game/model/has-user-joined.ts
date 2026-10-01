import { isNull } from "es-toolkit";
export function hasUserJoined({
  participants,
  userId,
}: {
  participants: { userId: string }[];
  userId: string | null;
}): boolean {
  return !isNull(userId) && participants.some((participant) => participant.userId === userId);
}
