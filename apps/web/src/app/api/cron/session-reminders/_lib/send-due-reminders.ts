import { and, gt, isNotNull, isNull, lte } from "drizzle-orm";
import { compact } from "es-toolkit";

import { db, games, notifySessionStartingSoon } from "@/shared/server";

const ONE_HOUR_MS = 60 * 60 * 1000;

// 크론 전용 배치라 feature가 아닌 라우트가 소유한다.
export async function sendDueReminders() {
  const now = new Date();
  const inOneHour = new Date(now.getTime() + ONE_HOUR_MS);

  // Atomically claim first so overlapping cron runs can't double-notify.
  // ponytail: claim-first means a webhook failure won't retry — acceptable for reminders.
  const claimed = await db
    .update(games)
    .set({ notifiedAt: now })
    .where(
      and(
        isNotNull(games.confirmedAt),
        isNull(games.notifiedAt),
        gt(games.confirmedAt, now),
        lte(games.confirmedAt, inOneHour),
      ),
    )
    .returning({ id: games.id });

  let sent = 0;
  for (const { id } of claimed) {
    const game = await db.query.games.findFirst({
      where: (gameRow, { eq }) => eq(gameRow.id, id),
      with: {
        gm: { columns: { discordId: true, username: true } },
        participants: { with: { user: { columns: { discordId: true } } } },
      },
    });
    if (!game?.confirmedAt) continue;

    const mentionIds = compact([
      game.gm?.discordId,
      ...game.participants.map((participant) => participant.user?.discordId),
    ]);

    await notifySessionStartingSoon(game, game.gm?.username ?? "?", mentionIds);
    sent++;
  }

  return { claimed: claimed.length, sent };
}
