import type { Metadata } from "next";

import { OG_IMAGE } from "@/shared/lib";
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
      // 부모 openGraph는 통째로 덮이므로 기본 이미지를 여기서도 깐다.
      images: [game.thumbnailSpoiler ? OG_IMAGE : (game.thumbnailUrl ?? OG_IMAGE)],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <GameDetailView id={id} />;
}
