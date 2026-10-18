import type { getRecruitingGamesPage } from "@roll-and-call/database/games";

export type GamesPage = Awaited<ReturnType<typeof getRecruitingGamesPage>>;
