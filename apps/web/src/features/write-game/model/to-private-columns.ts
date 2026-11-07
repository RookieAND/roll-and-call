import { PRIVATE_GAME_COLUMNS, privateEndDate } from "@roll-and-call/database/games/model";

import type { toGameColumns } from "./to-game-columns";

export function toPrivateColumns(columns: ReturnType<typeof toGameColumns>) {
  return {
    ...columns,
    ...PRIVATE_GAME_COLUMNS,
    endDate: privateEndDate(columns),
  };
}
