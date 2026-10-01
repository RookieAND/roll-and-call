import type { Game } from "@/shared/server";

export type GameDefaults = Omit<Game, "endDate"> & { endDate?: Date };
