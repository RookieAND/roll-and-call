import { parseGameSort } from "@/entities/game";
import { GamesView } from "@/views/games";

// Live recruiting board — read at request time, never prerendered.
export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    sort?: string;
  }>;
}) {
  const sp = await searchParams;
  return <GamesView page={Number(sp.page) || 1} q={sp.q} sort={parseGameSort(sp.sort)} />;
}
