import type { Metadata } from "next";

import { OG_IMAGE } from "@/shared/lib";
import { getGameById } from "@/shared/server";
import { DrawResultView } from "@/views/draw-result";

const DESCRIPTION = "1d100 추첨으로 정한 확정·대기 명단";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const game = await getGameById(id);
  if (!game) return { title: "추첨 결과" };

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
  const { id } = await params;
  return <DrawResultView id={id} />;
}
