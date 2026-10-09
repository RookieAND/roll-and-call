"use server";

import {
  listAttendanceRows,
  markAttendanceConfirmed,
  saveAttendance,
} from "@roll-and-call/database/games";
import { gmAttendanceNotices } from "@roll-and-call/database/games/model";
import { createNotifications } from "@roll-and-call/database/notifications";
import { isNull } from "es-toolkit";
import { after } from "next/server";
import { z } from "zod";

import { idSchema, parseActionInput, type ActionResult } from "@/shared/api";
import { getCurrentServer, siteOrigin, syncGameReviewForumPosts } from "@/shared/server";

import { ABSENCE_REASON_MAX_LENGTH, absencesError } from "../model/absences-error";
import { AttendanceError } from "./attendance-error";
import { guardAttendance } from "./guard-attendance";

// 정원 상한 20명에 대기·불참까지 더해도 넘지 않을 값.
const ABSENCES_MAX = 40;
// 사유의 길이 안내는 absencesError가 한다. 여기서는 터무니없이 긴 입력만 막는다.
const REASON_INPUT_MAX = ABSENCE_REASON_MAX_LENGTH * 5;

const inputSchema = z.object({
  gameId: idSchema,
  absences: z
    .array(z.object({ userId: idSchema, reason: z.string().max(REASON_INPUT_MAX).nullable() }))
    .max(ABSENCES_MAX),
});

// 명단 전원을 다시 쓴다. 기본값이 참석이라 absences에 없는 사람은 참석이고, 내보낸 사람은 확정으로 돌아온다.
// 불참 기록·취소·후기 알림은 같은 트랜잭션에서 넣는다.
export async function confirmAttendance(input: z.input<typeof inputSchema>): Promise<ActionResult> {
  const parsed = parseActionInput(inputSchema, input);
  if (!parsed.ok) return parsed.result;
  const { gameId, absences } = parsed.data;
  const serverId = (await getCurrentServer()).id;
  const result = await guardAttendance({
    gameId,
    userIds: absences.map((absence) => absence.userId),
    work: async (transaction, { confirmedUserIds, removedUserIds }, game) => {
      const rosterUserIds = [...confirmedUserIds, ...removedUserIds];
      const error = absencesError({ absences, rosterUserIds });
      if (!isNull(error)) throw new AttendanceError(error);

      const firstConfirmation = isNull(game.attendanceFirstConfirmedAt);
      const changes = await saveAttendance({
        transaction,
        serverId,
        gameId,
        rosterUserIds,
        absences,
      });
      await markAttendanceConfirmed({ transaction, serverId, gameId, at: new Date() });
      const rows = await listAttendanceRows({
        transaction,
        serverId,
        gameId,
        userIds: rosterUserIds,
      });
      await createNotifications({
        executor: transaction,
        serverId,
        actorId: game.gmId,
        notifications: gmAttendanceNotices({
          game: { id: gameId, title: game.title },
          rows,
          changes,
          firstConfirmation,
        }),
      });
    },
  });
  if (!result.error) {
    after(() => syncGameReviewForumPosts({ serverId, gameId, siteOrigin: siteOrigin() }));
  }
  return result;
}
