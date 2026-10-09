"use server";

import {
  confirmGameSession,
  listParticipantUserIds,
  lockGame,
} from "@roll-and-call/database/games";
import { createNotifications } from "@roll-and-call/database/notifications";
import { NOTIFICATION_KIND } from "@roll-and-call/database/notifications/model";
import { withTransaction } from "@roll-and-call/database/transaction";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { z } from "zod";

import { PARTICIPANT_STATUS } from "@/entities/game";
import { idSchema, parseActionInput, type ActionResult } from "@/shared/api";
import { serverPath } from "@/shared/lib";
import {
  getActingMember,
  notifySessionConfirmed,
  refreshRecruitPost,
  notMemberError,
} from "@/shared/server";

import { CONFIRM_FORBIDDEN_MESSAGE, confirmBlockReason } from "../model/confirm-block-reason";

const inputSchema = z.object({ gameId: idSchema, slotIso: z.iso.datetime({ offset: true }) });

export async function confirmSession(input: z.input<typeof inputSchema>): Promise<ActionResult> {
  const parsed = parseActionInput(inputSchema, input);
  if (!parsed.ok) return parsed.result;
  const { gameId, slotIso } = parsed.data;
  const member = await getActingMember();
  if (!member) {
    return { error: await notMemberError() };
  }
  const { server, user } = member;

  const confirmedAt = new Date(slotIso);
  if (Number.isNaN(confirmedAt.getTime())) return { error: "잘못된 시간입니다." };

  // 같은 구인의 명단 조정·추첨·구인 수정과 줄을 서도록 행을 잠그고 검사·저장·알림을 한 번에 한다.
  const result = await withTransaction(async (transaction) => {
    const game = await lockGame({ transaction, serverId: server.id, gameId });
    const block = confirmBlockReason({ game, userId: user.id, startsAt: confirmedAt });
    if (block || !game) return block ?? { error: CONFIRM_FORBIDDEN_MESSAGE };

    const updated = await confirmGameSession({
      transaction,
      serverId: server.id,
      gameId,
      gmId: user.id,
      confirmedAt,
    });
    if (!updated) return { error: CONFIRM_FORBIDDEN_MESSAGE };

    const previousConfirmedAt = game.confirmedAt;
    if (previousConfirmedAt?.getTime() !== confirmedAt.getTime()) {
      const confirmedIds = await listParticipantUserIds({
        transaction,
        serverId: server.id,
        gameId,
        status: PARTICIPANT_STATUS.confirmed,
      });
      const startsAt = confirmedAt.toISOString();
      const notification = previousConfirmedAt
        ? {
            kind: NOTIFICATION_KIND.sessionTimeChanged,
            params: {
              gameId,
              gameTitle: game.title,
              previousStartsAt: previousConfirmedAt.toISOString(),
              startsAt,
            },
          }
        : {
            kind: NOTIFICATION_KIND.sessionTimeSet,
            params: { gameId, gameTitle: game.title, startsAt },
          };
      await createNotifications({
        executor: transaction,
        serverId: server.id,
        actorId: user.id,
        notifications: confirmedIds.map((userId) => ({ userId, ...notification })),
      });
    }
    return { previousConfirmedAt };
  });
  if (!("previousConfirmedAt" in result)) return result;
  const { previousConfirmedAt } = result;

  after(() =>
    Promise.all([
      refreshRecruitPost({ server, gameId }),
      notifySessionConfirmed({ server, gameId, previousConfirmedAt }),
    ]),
  );

  const gamePath = serverPath({ slug: server.slug, path: `/games/${gameId}` });
  revalidatePath(gamePath);
  revalidatePath(`${gamePath}/schedule`);
  revalidatePath(`${gamePath}/confirm`);
  revalidatePath(`${gamePath}/manage`);
  revalidatePath(`${gamePath}/participants`);
  revalidatePath(serverPath({ slug: server.slug, path: "/games" }));
  redirect(gamePath);
}
