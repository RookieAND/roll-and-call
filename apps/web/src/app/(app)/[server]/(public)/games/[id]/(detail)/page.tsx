import type { Metadata } from "next";
import { after } from "next/server";

import { OG_IMAGE } from "@/shared/lib";
import {
  detectRosterDepartures,
  getCurrentMembership,
  getCurrentServer,
  getGameById,
} from "@/shared/server";
import { GameDetailView, GameMemberOnlyView } from "@/views/game-detail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const server = await getCurrentServer();
  const game = await getGameById(server.id, id);
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

// 비멤버에게도 OG 미리보기가 나가도록 (public)에 두고, 본문만 멤버 여부로 가른다.
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, membership, server] = await Promise.all([
    params,
    getCurrentMembership(),
    getCurrentServer(),
  ]);
  if (membership) after(() => detectRosterDepartures({ server, gameId: id }));
  return membership ? <GameDetailView id={id} /> : <GameMemberOnlyView id={id} />;
}
