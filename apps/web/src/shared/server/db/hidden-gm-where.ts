import "server-only";
import { db, games, profiles } from "@roll-and-call/database";
import { and, like, ne, notInArray } from "drizzle-orm";

// ponytail: 루키 계정과 테스트 계정(가짜 디스코드 ID 9000…)에 테스트 게임을 쌓아 두는 동안만 공개 목록에서 뺀다. 테스트가 끝나면 이 파일째 지운다.
const HIDDEN_GM_ID = "4fb3be08-5b9c-45a2-85bd-48f8ef138c71";
const TEST_DISCORD_ID_PATTERN = "9000000000000000%";

export const hiddenGmWhere = and(
  ne(games.gmId, HIDDEN_GM_ID),
  notInArray(
    games.gmId,
    db
      .select({ id: profiles.id })
      .from(profiles)
      .where(like(profiles.discordId, TEST_DISCORD_ID_PATTERN)),
  ),
)!;
