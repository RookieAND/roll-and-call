import type { Metadata } from "next";

import { RECRUIT_METHOD } from "@/entities/game";
import { OG_IMAGE } from "@/shared/lib";
import { getCurrentServer, getGameById, requireMembership } from "@/shared/server";
import { DrawResultView } from "@/views/draw-result";

const DESCRIPTION = "1d100 추첨으로 정한 확정·대기 명단";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  await requireMembership();
  const { id } = await params;
  const server = await getCurrentServer();
  const game = await getGameById(server.id, id);
  if (!game || game.recruitMethod !== RECRUIT_METHOD.lottery) return { title: "추첨 결과" };

  const title = `${game.title} 추첨 결과`;
  return {
    title,
    description: DESCRIPTION,
    openGraph: {
      title,
      description: DESCRIPTION,
      // 부모 openGraph는 통째로 덮이므로 기본 이미지를 여기서도 깐다.
      images: [game.thumbnailSpoiler ? OG_IMAGE : (game.thumbnailUrl ?? OG_IMAGE)],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requireMembership();
  const { id } = await params;
  return <DrawResultView id={id} />;
}
