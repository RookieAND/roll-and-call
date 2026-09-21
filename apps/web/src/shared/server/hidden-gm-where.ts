import "server-only";
import { games } from "@trpg/database";
import { ne } from "drizzle-orm";

// ponytail: 루키 계정에 테스트 게임을 쌓아 두는 동안만 공개 목록에서 뺀다. 테스트가 끝나면 이 파일째 지운다.
const HIDDEN_GM_ID = "4fb3be08-5b9c-45a2-85bd-48f8ef138c71";

export const hiddenGmWhere = ne(games.gmId, HIDDEN_GM_ID);
