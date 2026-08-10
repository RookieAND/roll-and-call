import { and, gt, isNotNull, isNull, lte } from "drizzle-orm";
import { db, games } from "@/shared/api/db";
import { sendDiscordAnnouncement } from "@/shared/api/discord/webhook";
import { formatDateTime } from "@/shared/lib/format";

const ONE_HOUR_MS = 60 * 60 * 1000;

export async function sendDueReminders() {
  const now = new Date();
  const inOneHour = new Date(now.getTime() + ONE_HOUR_MS);

  // Atomically claim sessions starting within the next hour so overlapping cron
  // runs can't double-notify. ponytail: claim-first means a webhook failure won't
  // retry — acceptable for reminders (avoiding double-pings matters more).
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
      where: (g, { eq }) => eq(g.id, id),
      with: {
        kp: { columns: { discordId: true, username: true } },
        participants: { with: { user: { columns: { discordId: true } } } },
      },
    });
    if (!game?.confirmedAt) continue;

    const mentionIds = [
      game.kp?.discordId,
      ...game.participants.map((p) => p.user?.discordId),
    ].filter((did): did is string => Boolean(did));

    const mentions = mentionIds.map((did) => `<@${did}>`).join(" ");
    const content =
      `⏰ 곧 시작! **${game.title}** 세션이 ${formatDateTime(game.confirmedAt)}에 시작해요.\n` +
      `룰: ${game.rule} · KP: ${game.kp?.username ?? "?"}\n${mentions}`;

    await sendDiscordAnnouncement({ content, userMentions: mentionIds });
    sent++;
  }

  return { claimed: claimed.length, sent };
}
