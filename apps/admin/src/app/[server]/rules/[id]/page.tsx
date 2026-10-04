import { isString } from "es-toolkit";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getRulebookDetail, requireStaff, searchGrantCandidates } from "@/shared/server";
import {
  RULEBOOK_DETAIL_TAB,
  RulebookDetailView,
  type RulebookDetailTab,
} from "@/views/rulebook-detail";

export async function generateMetadata({
  params,
}: PageProps<"/[server]/rules/[id]">): Promise<Metadata> {
  const rulebook = await getRulebookDetail((await params).id);
  return { title: rulebook ? `${rulebook.label} 룰북 상세` : "룰북 상세" };
}

export default async function RulebookDetailPage({
  params,
  searchParams,
}: PageProps<"/[server]/rules/[id]">) {
  const [{ id }, { tab, action, q, page }, staff] = await Promise.all([
    params,
    searchParams,
    requireStaff(),
  ]);
  const rulebook = await getRulebookDetail(id);
  if (!rulebook) notFound();
  const detailTab: RulebookDetailTab =
    Object.values(RULEBOOK_DETAIL_TAB).find(
      (candidate) =>
        candidate === tab && (candidate !== RULEBOOK_DETAIL_TAB.quiz || rulebook.certRequired),
    ) ?? RULEBOOK_DETAIL_TAB.info;
  const grantCandidates =
    action === "grant" && isString(q) ? await searchGrantCandidates(id, q) : [];
  return (
    <RulebookDetailView
      rulebook={rulebook}
      tab={detailTab}
      grantCandidates={grantCandidates}
      viewerId={staff.id}
      page={isString(page) ? page : undefined}
    />
  );
}
