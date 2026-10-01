import "server-only";
import { games } from "@roll-and-call/database";
import { and, isNull } from "drizzle-orm";

import { hiddenGmWhere } from "./hidden-gm-where";

export const publicGamesWhere = and(isNull(games.hiddenAt), hiddenGmWhere)!;
