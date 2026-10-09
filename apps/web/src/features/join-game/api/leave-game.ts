"use server";

import {
  countParticipants,
  deleteParticipant,
  findParticipantStatus,
  listSeatOpenedRecipients,
  lockGame,
} from "@roll-and-call/database/games";
import { createNotifications } from "@roll-and-call/database/notifications";
import { NOTIFICATION_KIND } from "@roll-and-call/database/notifications/model";
import { getMemberNickname } from "@roll-and-call/database/profiles";
import { withTransaction } from "@roll-and-call/database/transaction";
import { revalidatePath } from "next/cache";
import { after } from "next/server";

import {
  CONFIRMED_LEAVE_BLOCK,
  confirmedLeaveBlock,
  type ConfirmedLeaveBlock,
  PARTICIPANT_STATUS,
  type ParticipantStatus,
  WAITING_LEAVE_BLOCK,
  waitingLeaveBlock,
  type WaitingLeaveBlock,
} from "@/entities/game";
import {
  GAME_CANCELLED_MESSAGE,
  GAME_NOT_FOUND_RESULT,
  idSchema,
  LEAVE_AFTER_SCHEDULE_MESSAGE,
  LEAVE_DRAWN_MESSAGE,
  LEAVE_SELECTED_MESSAGE,
  LEAVE_EXPIRED_MESSAGE,
  LEAVE_FULL_MESSAGE,
  LOTTERY_CANCEL_CLOSED_MESSAGE,
  parseActionInput,
  WAITLIST_CANCEL_ENDED_MESSAGE,
  type ActionResult,
} from "@/shared/api";
import { serverPath } from "@/shared/lib";
import {
  getActingMember,
  notifyGameLeft,
  refreshRecruitPost,
  notMemberError,
} from "@/shared/server";

import { UNKNOWN_USERNAME } from "../model/unknown-username";

const CONFIRMED_LEAVE_MESSAGE: Record<ConfirmedLeaveBlock, string> = {
  [CONFIRMED_LEAVE_BLOCK.schedule]: LEAVE_AFTER_SCHEDULE_MESSAGE,
  [CONFIRMED_LEAVE_BLOCK.drawn]: LEAVE_DRAWN_MESSAGE,
  [CONFIRMED_LEAVE_BLOCK.selected]: LEAVE_SELECTED_MESSAGE,
  [CONFIRMED_LEAVE_BLOCK.expired]: LEAVE_EXPIRED_MESSAGE,
  [CONFIRMED_LEAVE_BLOCK.full]: LEAVE_FULL_MESSAGE,
};

const WAITING_LEAVE_MESSAGE: Record<WaitingLeaveBlock, string> = {
  [WAITING_LEAVE_BLOCK.closed]: LOTTERY_CANCEL_CLOSED_MESSAGE,
  [WAITING_LEAVE_BLOCK.ended]: WAITLIST_CANCEL_ENDED_MESSAGE,
};

type LeaveResult = ActionResult & { leftStatus?: ParticipantStatus };

export async function leaveGame(gameId: string): Promise<LeaveResult> {
  const parsed = parseActionInput(idSchema, gameId);
  if (!parsed.ok) return parsed.result;

  const member = await getActingMember();
  if (!member) {
    return { error: await notMemberError() };
  }
  const { server, user } = member;
  const serverId = server.id;

  // 추첨 신청자는 모집 마감 전까지, 대기자는 세션이 끝날 때까지 취소한다.
  // 확정자는 신청 닫힘·마감·추첨 뒤·정원 참(대기자 없음)이면 막아 GM을 거친다(D245, D259, D264).
  // 같은 구인의 신청·명단 조정·출석과 줄을 서도록 구인 행을 잠근다.
  const result = await withTransaction(async (transaction): Promise<LeaveResult> => {
    const game = await lockGame({ transaction, serverId, gameId });
    if (!game) return GAME_NOT_FOUND_RESULT;
    if (game.cancelledAt) return { error: GAME_CANCELLED_MESSAGE };

    const status = await findParticipantStatus({ transaction, serverId, gameId, userId: user.id });
    if (!status || status === PARTICIPANT_STATUS.removed) {
      return { error: "참여 중이 아닙니다." };
    }

    if (status === PARTICIPANT_STATUS.confirmed) {
      const confirmedCount = await countParticipants({
        transaction,
        serverId,
        gameId,
        status: PARTICIPANT_STATUS.confirmed,
      });
      const waitingCount = await countParticipants({
        transaction,
        serverId,
        gameId,
        status: PARTICIPANT_STATUS.waiting,
      });
      const block = confirmedLeaveBlock({ game, confirmedCount, waitingCount });
      if (block) return { error: CONFIRMED_LEAVE_MESSAGE[block] };
    } else {
      const block = waitingLeaveBlock({ game });
      if (block) return { error: WAITING_LEAVE_MESSAGE[block] };
    }

    await deleteParticipant({ transaction, serverId, gameId, userId: user.id });
    // 확정자가 비운 자리만 알린다: GM에게 participant_left(D262), 대기자에게 seat_opened. 대기·신청 취소는 알림이 없다.
    if (status === PARTICIPANT_STATUS.confirmed) {
      const params = { gameId, gameTitle: game.title };
      const nickname = await getMemberNickname({
        executor: transaction,
        serverId,
        userId: user.id,
      });
      const recipients = await listSeatOpenedRecipients({ transaction, serverId, gameId, game });
      await createNotifications({
        executor: transaction,
        serverId,
        actorId: user.id,
        notifications: [
          {
            userId: game.gmId,
            kind: NOTIFICATION_KIND.participantLeft,
            params: { ...params, nickname: nickname ?? UNKNOWN_USERNAME },
          },
          ...recipients.map((recipientId) => ({
            userId: recipientId,
            kind: NOTIFICATION_KIND.seatOpened,
            params,
          })),
        ],
      });
    }
    return { leftStatus: status };
  });
  if (result.error) return result;

  after(async () => {
    await notifyGameLeft({ server, gameId, userId: user.id, removedByGm: false });
    await refreshRecruitPost({ server, gameId });
  });

  const gamePath = serverPath({ slug: server.slug, path: `/games/${gameId}` });
  revalidatePath(gamePath);
  revalidatePath(`${gamePath}/participants`);
  revalidatePath(serverPath({ slug: server.slug, path: "/games" }));
  return result;
}
