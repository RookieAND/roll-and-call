import { and, eq, isNull } from "drizzle-orm";

import { games } from "../../schema";
import { hiddenGmWhere } from "./hidden-gm-where";

export function publicGamesWhere(serverId: string) {
  return and(eq(games.serverId, serverId), isNull(games.hiddenAt), hiddenGmWhere)!;
}
