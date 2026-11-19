import { listParticipantUserIds } from "@roll-and-call/database/games";
import { PARTICIPANT_STATUS } from "@roll-and-call/database/games/model";
import { withTransaction } from "@roll-and-call/database/transaction";

import { aggregateAvailability, rankWindows, type SessionWindow } from "@/entities/availability";
import { checkScheduleConflicts } from "@/entities/game/server";
import { roundCandidateLine, type RoundCandidate } from "@/features/schedule-round";
import { SLOT_MINUTES, toKstDateTimeInput } from "@/shared/lib";

const CANDIDATE_LIMIT = 3;
const MINUTE_MS = 60_000;

interface LoadRoundCandidatesParams {
  serverId: string;
  gameId: string;
  gmId: string;
  roundNo: number;
  playMinutes: number;
  now: Date;
  availabilities: Parameters<typeof aggregateAvailability>[0]["avails"];
  totalCount: number;
  nicknames: Record<string, string>;
}

// 모은 가능 시간에서 겹치는 시간 상위 3개. 참여자나 GM이 다른 세션과 겹치면 힌트를 달아 고를 수 없게 한다.
export async function loadRoundCandidates({
  serverId,
  gameId,
  gmId,
  roundNo,
  playMinutes,
  now,
  availabilities,
  totalCount,
  nicknames,
}: LoadRoundCandidatesParams): Promise<RoundCandidate[]> {
  const { names } = aggregateAvailability({ avails: availabilities, userId: null });
  const slotCount = Math.ceil(playMinutes / SLOT_MINUTES);
  const windows: SessionWindow[] = rankWindows({ names, slotCount, limit: Infinity })
    .filter((window) => new Date(window.iso) > now)
    .slice(0, CANDIDATE_LIMIT);
  if (windows.length === 0) return [];

  return withTransaction(async (transaction) => {
    const confirmedUserIds = await listParticipantUserIds({
      transaction,
      serverId,
      gameId,
      status: PARTICIPANT_STATUS.confirmed,
    });
    const candidates: RoundCandidate[] = [];
    for (const window of windows) {
      const startsAt = new Date(window.iso);
      const endsAt = new Date(startsAt.getTime() + playMinutes * MINUTE_MS);
      const conflict = await checkScheduleConflicts({
        transaction,
        serverId,
        gameId,
        gmId,
        confirmedUserIds,
        rounds: [{ roundNo, startsAt, endsAt }],
      });
      // 참여자 겹침이 없으면 GM 본인의 겹침이다.
      const overlappedUserId = conflict ? (conflict.conflicts[0]?.userId ?? gmId) : null;
      const conflictHint = overlappedUserId
        ? `${nicknames[overlappedUserId] ?? "참여자"}님 다른 세션과 겹침`
        : null;
      candidates.push({
        startsAt: toKstDateTimeInput(startsAt),
        endsAt: toKstDateTimeInput(endsAt),
        line: roundCandidateLine({
          startsAt,
          endsAt,
          memberCount: window.members.length,
          totalCount,
        }),
        conflictHint,
      });
    }
    return candidates;
  });
}
