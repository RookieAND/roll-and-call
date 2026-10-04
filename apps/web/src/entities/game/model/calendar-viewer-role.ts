import { CALENDAR_VIEWER_ROLE, type CalendarViewerRole } from "./can-add-to-calendar";
import { PARTICIPANT_STATUS, type ParticipantStatus } from "./participant";

export function calendarViewerRole({
  game,
  viewerId,
}: {
  game: { gmId: string; participants: readonly { userId: string; status: ParticipantStatus }[] };
  viewerId: string | null;
}): CalendarViewerRole {
  if (game.gmId === viewerId) return CALENDAR_VIEWER_ROLE.gm;
  const confirmed = game.participants.some(
    (participant) =>
      participant.userId === viewerId && participant.status === PARTICIPANT_STATUS.confirmed,
  );
  return confirmed ? CALENDAR_VIEWER_ROLE.confirmed : CALENDAR_VIEWER_ROLE.other;
}
