import type { Game } from "@roll-and-call/database";

// 수정은 구인 전체를, 다시 열기는 가져올 값만 넘긴다.
export type GameDefaults = Partial<Omit<Game, "endDate">> & { endDate?: Date };
