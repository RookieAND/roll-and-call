import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { after } from "next/server";

import { OG_IMAGE, serverJoinPath, serverPath } from "@/shared/lib";
import {
  detectRosterDepartures,
  getCurrentMembership,
  getCurrentServer,
  getGameById,
} from "@/shared/server";
import { GameDetailView } from "@/views/game-detail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const server = await getCurrentServer();
  const game = await getGameById(server.id, id);
  if (!game) return { title: "구인글" };
  // 숨긴 구인은 보는 사람과 상관없이 기본 제목·기본 이미지로 미리보기를 낸다(R7).
  if (game.hiddenAt) return { title: "구인글", openGraph: { title: "구인글", images: [OG_IMAGE] } };

  return {
    title: game.title,
    openGraph: {
      title: game.title,
      // 부모 openGraph는 통째로 덮이므로 기본 이미지를 여기서도 깐다.
      images: [game.thumbnailSpoiler ? OG_IMAGE : (game.thumbnailUrl ?? OG_IMAGE)],
    },
  };
}

// 비멤버는 가입 화면으로 보내고, 가입을 마치면 이 구인으로 돌아온다.
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, membership, server] = await Promise.all([
    params,
    getCurrentMembership(),
    getCurrentServer(),
  ]);
  if (!membership) {
    redirect(
      serverJoinPath({
        slug: server.slug,
        next: serverPath({ slug: server.slug, path: `/games/${id}` }),
      }),
    );
  }
  after(() => detectRosterDepartures({ server, gameId: id }));
  return <GameDetailView id={id} />;
}
