import { countConfirmed, PARTICIPANT_STATUS, SESSION_ROLE } from "@/entities/game";
import { derivePlayStance } from "@/entities/profile";

import { PROFILE_SESSION_TAB, type ProfileSessionTab } from "./profile-sessions";
import {
  SESSION_BUCKET,
  type SessionCardModel,
  type SessionContext,
  type SessionGame,
} from "./session-card-model";
import { toSessionCard } from "./to-session-card";

export function buildProfileSessions({
  hosted,
  joined,
  userId,
  now = new Date(),
}: {
  hosted: SessionGame[];
  joined: SessionGame[];
  userId: string;
  now?: Date;
}) {
  const context: SessionContext = {
    viewerId: userId,
    respondedGameIds: new Set(),
    responseCounts: new Map(),
    now,
    readOnly: true,
  };
  // 대기 중인 신청은 남의 프로필에 쓰지 않는다.
  const played = joined.filter((game) =>
    game.participants.some(
      (participant) =>
        participant.userId === userId && participant.status === PARTICIPANT_STATUS.confirmed,
    ),
  );
  const isFinished = (game: SessionGame) =>
    game.confirmedAt !== null &&
    new Date(game.confirmedAt).getTime() < now.getTime() &&
    countConfirmed(game.participants) > 0;
  const isPast = (card: SessionCardModel) => card.bucket === SESSION_BUCKET.past;

  const hostedCards = hosted
    .map((game) => toSessionCard(game, SESSION_ROLE.host, context))
    .toSorted(
      (left, right) => Number(isPast(left)) - Number(isPast(right)) || left.sortKey - right.sortKey,
    );
  const playedCards = played
    .map((game) => toSessionCard(game, SESSION_ROLE.player, context))
    .toSorted((left, right) => left.sortKey - right.sortKey);

  const finishedHosted = hosted.filter(isFinished).length;
  const finishedPlayed = played.filter(isFinished).length;

  const sessions: Record<ProfileSessionTab, SessionCardModel[]> = {
    [PROFILE_SESSION_TAB.hosted]: hostedCards,
    [PROFILE_SESSION_TAB.upcoming]: playedCards.filter((card) => !isPast(card)),
    [PROFILE_SESSION_TAB.past]: playedCards.filter(isPast),
  };

  return {
    sessions,
    stance: {
      label: derivePlayStance({ hosted: finishedHosted, played: finishedPlayed }),
      hosted: finishedHosted,
      played: finishedPlayed,
    },
  };
}
