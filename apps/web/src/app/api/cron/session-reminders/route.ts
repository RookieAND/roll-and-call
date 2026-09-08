import { and, gt, isNotNull, isNull, lte } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db, games } from "@/shared/api/db";
import { notifySessionStartingSoon } from "@/shared/api/discord/notify";

export const dynamic = "force-dynamic";

const ONE_HOUR_MS = 60 * 60 * 1000;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const result = await sendDueReminders();
  return NextResponse.json(result);
}

// 크론 전용 배치. 사용자 동작이 아니라 feature가 아닌 라우트가 소유한다.
async function sendDueReminders() {
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
        gm: { columns: { discordId: true, username: true } },
        participants: { with: { user: { columns: { discordId: true } } } },
      },
    });
    if (!game?.confirmedAt) continue;

    const mentionIds = [
      game.gm?.discordId,
      ...game.participants.map((p) => p.user?.discordId),
    ].filter((did): did is string => Boolean(did));

    await notifySessionStartingSoon(game, game.gm?.username ?? "?", mentionIds);
    sent++;
  }

  return { claimed: claimed.length, sent };
}
