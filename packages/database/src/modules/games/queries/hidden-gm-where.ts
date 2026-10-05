import { like, notInArray } from "drizzle-orm";

import { db } from "#/client";
import { TEST_DISCORD_ID_PREFIX } from "#/modules/servers/model/is-test-discord-id";
import { games, profiles } from "#/schema";

// ponytail: 테스트 계정(가짜 디스코드 ID 9000…)에 테스트 게임을 쌓아 두는 동안만 공개 목록에서 뺀다. 테스트가 끝나면 이 파일째 지운다.
export const hiddenGmWhere = notInArray(
  games.gmId,
  db
    .select({ id: profiles.id })
    .from(profiles)
    .where(like(profiles.discordId, `${TEST_DISCORD_ID_PREFIX}%`)),
);
