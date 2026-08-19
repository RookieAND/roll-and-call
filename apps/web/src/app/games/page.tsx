import type { GameStatus } from "@/entities/game";
import { GamesView } from "@/views/games";

// Live recruiting board — read at request time, never prerendered.
export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    status?: string;
    sort?: string;
  }>;
}) {
  const sp = await searchParams;
  return (
    <GamesView
      page={Number(sp.page) || 1}
      q={sp.q}
      status={sp.status as GameStatus | undefined}
      sort={sp.sort as "latest" | "deadline" | undefined}
    />
  );
}
