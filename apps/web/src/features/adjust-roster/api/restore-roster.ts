"use server";

import {
  countParticipants,
  findParticipantStatus,
  setParticipantStatus,
} from "@roll-and-call/database/games";
import { NOTIFICATION_KIND } from "@roll-and-call/database/notifications/model";
import { isNull } from "es-toolkit";

import { PARTICIPANT_STATUS, RECRUIT_METHOD } from "@/entities/game";
import type { ActionResult } from "@/shared/api";
import { notifyDirectConfirmed, notifyMovedToWaitlist } from "@/shared/server";

import type { RosterEntry } from "../model/roster-entry";
import { adjustRoster } from "./adjust-roster";
import { notifyRosterChange } from "./notify-roster-change";
import { RosterError } from "./roster-error";
import { WAITLIST_AFTER_START_MESSAGE } from "./waitlist-after-start-message";
import { waitlistRankOf } from "./waitlist-rank-of";

const ROSTER_CHANGED_MESSAGE = "명단이 바뀌어 되돌릴 수 없습니다.";
const { confirmed, waiting } = PARTICIPANT_STATUS;

// 대기로 되돌릴 때 waitlistedAt은 다시 쓰지 않는다. 저장된 값이 원래 자리다.
export async function restoreRoster({
  gameId,
  entries,
}: {
  gameId: string;
  entries: RosterEntry[];
}): Promise<ActionResult> {
  const valid = entries.every((entry) => entry.status === confirmed || entry.status === waiting);
  if (!valid || entries.length === 0) return { error: "되돌릴 수 없는 요청입니다." };
  const confirmedIds: string[] = [];
  const waitlistedIds: string[] = [];

  return adjustRoster({
    gameId,
    userIds: entries.map((entry) => entry.userId),
    work: async (transaction, game, { started }) => {
      const serverId = game.serverId;
      if (started && entries.some((entry) => entry.status === waiting)) {
        throw new RosterError(WAITLIST_AFTER_START_MESSAGE);
      }
      for (const entry of entries) {
        const status = await findParticipantStatus({
          transaction,
          serverId,
          gameId,
          userId: entry.userId,
        });
        if (status !== confirmed && status !== waiting) {
          throw new RosterError(ROSTER_CHANGED_MESSAGE);
        }
        if (status === entry.status) continue;
        await setParticipantStatus({
          transaction,
          serverId,
          gameId,
          userId: entry.userId,
          status: entry.status,
        });
        if (entry.status === confirmed) confirmedIds.push(entry.userId);
        else waitlistedIds.push(entry.userId);
      }
      const confirmedCount = await countParticipants({
        transaction,
        serverId,
        gameId,
        status: confirmed,
      });
      if (confirmedCount > game.maxPlayers) throw new RosterError(ROSTER_CHANGED_MESSAGE);
      // 추첨 전이면 대기가 아니라 추첨 신청자로 돌아간다. 스레드 안내도, 알림도 만들지 않는다.
      if (game.recruitMethod === RECRUIT_METHOD.lottery && isNull(game.drawnAt)) {
        waitlistedIds.length = 0;
      }
      const params = { gameId, gameTitle: game.title };
      const waitlisted = [];
      for (const userId of waitlistedIds) {
        const waitlistRank = await waitlistRankOf({ transaction, serverId, gameId, userId });
        waitlisted.push({
          userId,
          kind: NOTIFICATION_KIND.movedToWaitlist,
          params: { ...params, waitlistRank },
        });
      }
      await notifyRosterChange({
        transaction,
        game,
        notifications: [
          ...confirmedIds.map((userId) => ({
            userId,
            kind: NOTIFICATION_KIND.participationConfirmed,
            params,
          })),
          ...waitlisted,
        ],
      });
    },
    notify: async (server) => {
      await notifyDirectConfirmed({ server, gameId, userIds: confirmedIds });
      for (const userId of waitlistedIds) {
        await notifyMovedToWaitlist({ server, gameId, userId });
      }
    },
  });
}
