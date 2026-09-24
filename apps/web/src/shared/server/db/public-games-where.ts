import "server-only";
import { games } from "@roll-and-call/database";
import { and, isNull } from "drizzle-orm";

import { hiddenGmWhere } from "./hidden-gm-where";

// 공개 목록(구인·검색·캘린더)에 나오는 게임. 운영진이 숨긴 게임은 뺀다.
export const publicGamesWhere = and(isNull(games.hiddenAt), hiddenGmWhere)!;
