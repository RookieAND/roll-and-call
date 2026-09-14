import { and, eq, isNull } from "drizzle-orm";
import { db, games } from "./db";
import {
  createDiscordSessionRooms,
  DISCORD_ROOMS_OPENING,
  grantDiscordSessionRooms,
} from "./discord-bot";

// 세션 채널을 연다. 권한(GM 본인) 확인은 호출부가 한다 — GM이 직접 누를 때와 확정 시 자동 개설이 같은 길을 쓴다.
// 동시에 두 번 불려도 카테고리가 하나만 생기게 먼저 선점하고, 실패하면 선점을 푼다.
// 이 구인에서 채널을 끈 경우(discordRoomsDisabled)는 열지 않는다.
export async function openGameSessionRooms(gameId: string): Promise<{ error?: string }> {
  const claimed = await db
    .update(games)
    .set({ discordCategoryId: DISCORD_ROOMS_OPENING })
    .where(
      and(
        eq(games.id, gameId),
        isNull(games.discordCategoryId),
        eq(games.discordRoomsDisabled, false),
      ),
    )
    .returning({ id: games.id });
  if (claimed.length === 0) {
    return { error: "이미 채널이 열려 있거나 이 구인에서는 채널을 쓰지 않습니다." };
  }

  try {
    const game = await db.query.games.findFirst({
      where: (g, { eq: eqOp }) => eqOp(g.id, gameId),
      with: {
        gm: { columns: { discordId: true } },
        participants: {
          columns: { status: true },
          with: { user: { columns: { discordId: true } } },
        },
      },
    });
    if (!game?.gm) throw new Error("game or gm not found");

    const { categoryId, channelId } = await createDiscordSessionRooms({
      title: game.title,
      gmDiscordId: game.gm.discordId,
      playerDiscordIds: game.participants
        .filter((p) => p.status === "confirmed")
        .flatMap((p) => (p.user ? [p.user.discordId] : [])),
    });
    await db
      .update(games)
      .set({ discordCategoryId: categoryId, discordChannelId: channelId })
      .where(eq(games.id, gameId));
    return {};
  } catch (err) {
    console.error("openGameSessionRooms failed:", err);
    await db.update(games).set({ discordCategoryId: null }).where(eq(games.id, gameId));
    return { error: "디스코드 채널을 만들지 못했습니다." };
  }
}

// 채널이 열려 있으면 지금의 확정 참여자 전원에게 권한을 준다(뒤에 확정된 사람 자동 합류).
// 명단 조정·참여 뒤에 부른다. 디스코드 실패가 명단 동작을 막으면 안 되므로 실패는 삼킨다.
// ponytail: 대기로 내려간·내보낸 사람의 권한 회수는 하지 않는다(세션 종료 때 한꺼번에 걷힌다).
export async function syncSessionRoomMembers(gameId: string) {
  try {
    const game = await db.query.games.findFirst({
      where: (g, { eq: eqOp }) => eqOp(g.id, gameId),
      columns: { discordCategoryId: true, sessionEndedAt: true },
      with: {
        participants: {
          columns: { status: true },
          with: { user: { columns: { discordId: true } } },
        },
      },
    });
    const categoryId = game?.discordCategoryId;
    if (!categoryId || categoryId === DISCORD_ROOMS_OPENING || game.sessionEndedAt) return;

    const discordIds = game.participants
      .filter((p) => p.status === "confirmed")
      .flatMap((p) => (p.user ? [p.user.discordId] : []));
    await grantDiscordSessionRooms(categoryId, discordIds);
  } catch (err) {
    console.warn("syncSessionRoomMembers failed:", err);
  }
}
