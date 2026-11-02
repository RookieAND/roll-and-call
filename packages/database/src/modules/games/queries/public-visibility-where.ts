import { eq } from "drizzle-orm";

import { GAME_VISIBILITY } from "#db/modules/games/model/game-visibility";
import { games } from "#db/schema";

export const publicVisibilityWhere = eq(games.visibility, GAME_VISIBILITY.public);
