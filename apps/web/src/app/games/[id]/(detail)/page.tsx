import type { Metadata } from "next";

import { getGameById } from "@/shared/server";
import { GameDetailView } from "@/views/game-detail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const game = await getGameById(id);
  if (!game) return { title: "구인글" };

  return {
    title: game.title,
    openGraph: {
      title: game.title,
      ...(game.thumbnailUrl && !game.thumbnailSpoiler && { images: [game.thumbnailUrl] }),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <GameDetailView id={id} />;
}
