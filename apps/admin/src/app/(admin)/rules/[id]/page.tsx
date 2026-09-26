import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getRulebookDetail, searchGrantCandidates } from "@/shared/server";
import {
  RULEBOOK_DETAIL_TAB,
  RulebookDetailView,
  type RulebookDetailTab,
} from "@/views/rulebook-detail";

export async function generateMetadata({ params }: PageProps<"/rules/[id]">): Promise<Metadata> {
  const rulebook = await getRulebookDetail((await params).id);
  return { title: rulebook ? `${rulebook.label} 룰북 상세` : "룰북 상세" };
}

export default async function RulebookDetailPage({
  params,
  searchParams,
}: PageProps<"/rules/[id]">) {
  const [{ id }, { tab, action, q, page }] = await Promise.all([params, searchParams]);
  const rulebook = await getRulebookDetail(id);
  if (!rulebook) notFound();
  // 인증이 필요 없는 룰북에는 본문 퀴즈 탭이 없다.
  const detailTab: RulebookDetailTab =
    Object.values(RULEBOOK_DETAIL_TAB).find(
      (candidate) =>
        candidate === tab && (candidate !== RULEBOOK_DETAIL_TAB.quiz || rulebook.certRequired),
    ) ?? RULEBOOK_DETAIL_TAB.info;
  const grantCandidates =
    action === "grant" && typeof q === "string" ? await searchGrantCandidates(id, q) : [];
  return (
    <RulebookDetailView
      rulebook={rulebook}
      tab={detailTab}
      grantCandidates={grantCandidates}
      page={typeof page === "string" ? page : undefined}
    />
  );
}
