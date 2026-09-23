import type { getRecruitingGamesPage } from "@/shared/server";

export type GamesPage = Awaited<ReturnType<typeof getRecruitingGamesPage>>;
