export function hasUserJoined({
  participants,
  userId,
}: {
  participants: { userId: string }[];
  userId: string | null;
}): boolean {
  return userId !== null && participants.some((participant) => participant.userId === userId);
}
