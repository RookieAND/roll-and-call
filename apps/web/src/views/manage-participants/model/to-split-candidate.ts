import type { SplitCandidate } from "./split-candidate";

export function toSplitCandidate({
  userId,
  username,
  applicationNote,
  bio,
}: {
  userId: string;
  username: string;
  applicationNote: string | null;
  bio: string | null;
}): SplitCandidate {
  const noteLine = applicationNote?.split("\n")[0]?.trim();
  return { userId, username, subline: noteLine || bio || null };
}
