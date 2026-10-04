import { isNil } from "es-toolkit";

import type { Attendee } from "@/features/confirm-attendance";

type RosterParticipant = {
  userId: string;
  absent: boolean;
  absenceReason: string | null;
  absenceCancelledAt: Date | null;
  absenceAddedAt: Date | null;
  user: { username: string | null; avatarUrl: string | null; bio: string | null } | null;
};

// 내보낸 사람은 불참이 미리 골라져 있다(D210).
export function toAttendee({
  participant,
  removed,
}: {
  participant: RosterParticipant;
  removed: boolean;
}): Attendee {
  return {
    userId: participant.userId,
    username: participant.user?.username ?? "익명",
    avatarUrl: participant.user?.avatarUrl ?? null,
    bio: participant.user?.bio ?? null,
    absent: removed || participant.absent,
    removed,
    absenceReason: participant.absenceReason,
    staffCancelled: !isNil(participant.absenceCancelledAt),
    staffAdded: !isNil(participant.absenceAddedAt),
  };
}
